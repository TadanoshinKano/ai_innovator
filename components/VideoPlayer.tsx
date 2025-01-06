'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
  thumbnail_url?: string; // 使う場合はlightで指定できます
  videoId: number;
}

export default function VideoPlayer({
  videoUrl,
  onTimeUpdate,
  thumbnail_url,
  videoId,
}: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [duration, setDuration] = useState<number>(0);
  const [lastPosition, setLastPosition] = useState<number>(0);
  const [watchCount, setWatchCount] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  // 「一度だけシークする」ためのフラグ
  const [hasSeeked, setHasSeeked] = useState<boolean>(false);

  const supabase = useSupabaseClient();
  const session = useSession();

  console.log('Current session:', session);

  /**
   * ユーザーがログインしていて videoId が変わったら
   * 視聴状況をDBから取得 or なければ作成する
   */
  useEffect(() => {
    if (session?.user) {
      initializeWatchStatus();
    } else {
      console.error('ユーザーがログインしていません。');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, videoId]);

  /**
   * DBから視聴状況を取得 (なければ新規作成)
   */
  const initializeWatchStatus = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('video_watch_status')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('video_id', videoId)
      .single();

    if (error) {
      // レコードが無い (PGRST116) → 新規作成
      if (error.code === 'PGRST116') {
        console.log('視聴状況が存在しないため、新規作成します。');
        await createWatchStatus(session.user.id);
      } else {
        console.error('視聴状況の取得に失敗しました。', error);
      }
    } else if (data) {
      setLastPosition(data.last_position);
      setWatchCount(data.watch_count);
      setCompleted(data.completed);
    }
  };

  /**
   * 視聴状況がなければ 0秒 で作成
   */
  const createWatchStatus = async (userId: string) => {
    const { error } = await supabase
      .from('video_watch_status')
      .insert([
        {
          user_id: userId,
          video_id: videoId,
          last_position: 0,
          completed: false,
          watch_count: 1,
          completion_rate: 0,
        },
      ])
      .select();

    if (error) {
      console.error('視聴状況の作成に失敗しました。', error);
    } else {
      // 新規の場合は0秒からスタート
      setLastPosition(0);
      setWatchCount(1);
    }
  };

  /**
   * 再生中の進捗イベント
   */
  const handleProgress = async (state: { playedSeconds: number }) => {
    if (onTimeUpdate) {
      onTimeUpdate(state.playedSeconds);
    }
    // 小数秒を整数に
    const currentPositionInt = Math.floor(state.playedSeconds);
    setLastPosition(currentPositionInt);

    // DB更新
    await updateWatchStatus(currentPositionInt);
  };

  /**
   * DBの視聴状況を更新 (last_positionなど)
   */
  const updateWatchStatus = async (currentPosition: number) => {
    if (!session?.user) return;

    // 95% 以上再生したら「完了」にする例
    const completionRate = duration > 0 ? currentPosition / duration : 0;
    const isCompleted = completionRate >= 0.95;

    const { data, error } = await supabase
      .from('video_watch_status')
      .update({
        last_position: currentPosition,
        completed: isCompleted,
        completion_rate: completionRate,
      })
      .eq('user_id', session.user.id)
      .eq('video_id', videoId)
      .select();

    if (error) {
      console.error('視聴状況の更新に失敗しました。', error);
    } else if (data && data.length > 0) {
      setWatchCount(data[0].watch_count);
      setCompleted(isCompleted);
    }
  };

  /**
   * 動画が再生できる状態になったら
   * 前回の lastPosition に1回だけシーク
   */
  const handleReady = () => {
    setLoading(false);

    const player = playerRef.current?.getInternalPlayer();
    if (player instanceof HTMLVideoElement) {
      console.log('Video Dimensions:', player.videoWidth, player.videoHeight);
      setDuration(player.duration);
    }

    // まだシークしていなくて、かつ lastPosition > 0 ならシーク
    if (!hasSeeked && lastPosition > 0 && playerRef.current) {
      console.log(`Seeking to ${lastPosition} seconds`);
      playerRef.current.seekTo(lastPosition, 'seconds');
      setHasSeeked(true);
    }
  };

  /**
   * 動画読み込みエラー
   */
  const handleError = (e: any) => {
    setLoading(false);
    setError('動画の読み込みに失敗しました。');
    console.error('動画の読み込みエラー:', e);
  };

  // セッションが未ロードの間
  if (session === undefined) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="player-wrapper">
      {error && <div className="error-message">{error}</div>}
      {!session?.user && (
        <div className="error-message">ユーザーがログインしていません。</div>
      )}

      <div className="video-container">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          controls
          onReady={handleReady}
          onProgress={handleProgress}
          onError={handleError}
          width="100%"
          height="100%"
          className="react-player"
          // light={thumbnail_url} // サムネを使いたい場合はコメント解除。ただし挙動が変わる場合あり
          config={{
            file: {
              attributes: {
                // ▼ ダウンロード/ピクチャインピクチャを無効化する設定
                controlsList: 'nodownload',
                disablePictureInPicture: true,
                onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
              },
            },
          }}
        />
      </div>
    </div>
  );
}
