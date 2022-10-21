/**
 * webp 対応していれば target に is-webp、対応していなければ is-no-webp クラスを追加する
 *
 * @param {string} target (default: body)
 */
export const addWebpDetectionClass = (target = 'body') => {
  if (supportsWebp()) {
    $(target).addClass('is-webp');
  } else {
    $(target).addClass('is-no-webp');
  }
};

// addWebpDetectionClass(); // 実行
