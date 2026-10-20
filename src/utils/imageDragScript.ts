export const IMAGE_DRAG_SCRIPT = `
<script id="uni-image-drag">
(function() {
  console.log('[uni-image-drag] Script loaded, injecting event listeners');

  var activeImg = null, startX = 0, startY = 0, origX = 0, origY = 0, imgSrc = '', imgIndex = -1;

  function getTranslate(el) {
    var s = el.style.transform || '';
    var m = s.match(/translate\\(([-\\d.]+)px,\\s*([-\\d.]+)px\\)/);
    return m ? [parseFloat(m[1])||0, parseFloat(m[2])||0] : [0,0];
  }

  document.addEventListener('mousedown', function(e) {
    var target = e.target;
    var qrContainer = target && target.closest ? target.closest('#qrcode') : null;
    var isQr = !!qrContainer;
    if (!isQr && target.tagName.toLowerCase() !== 'img') return;
    if (target.closest('.uni-watermark-overlay, .uni-watermark-preview-overlay')) return;
    e.preventDefault();
    e.stopPropagation();

    activeImg = isQr ? qrContainer : target;
    startX = e.clientX;
    startY = e.clientY;
    var t = getTranslate(activeImg);
    origX = t[0];
    origY = t[1];
    imgSrc = isQr ? ('__qr__:' + ((activeImg.getAttribute('id') || 'qrcode'))) : (activeImg.getAttribute('src') || '');
    var rawIdx = isQr ? activeImg.getAttribute('data-qr-index') : activeImg.getAttribute('data-image-index');
    imgIndex = rawIdx !== null ? parseInt(rawIdx, 10) : -1;

    console.log('[uni-image-drag] mousedown', { imgSrc: imgSrc ? imgSrc.substring(0,80)+'...' : '(empty)', imgIndex, origX, origY, startX, startY });

    activeImg.style.cursor = 'grabbing';
    activeImg.style.transition = 'none';
    activeImg.style.zIndex = '999';
    activeImg.style.boxShadow = '0 0 0 2px #10b981, 0 8px 24px rgba(0,0,0,0.3)';
    activeImg.style.borderRadius = '4px';
  });

  document.addEventListener('mousemove', function(e) {
    if (!activeImg) return;
    e.preventDefault();
    var dx = e.clientX - startX + origX;
    var dy = e.clientY - startY + origY;
    activeImg.style.transform = 'translate(' + Math.round(dx) + 'px, ' + Math.round(dy) + 'px)';
  });

  document.addEventListener('mouseup', function(e) {
    if (!activeImg) return;
    activeImg.style.cursor = '';
    activeImg.style.transition = '';
    activeImg.style.zIndex = '';
    activeImg.style.boxShadow = '';
    activeImg.style.borderRadius = '';

    var dx = e.clientX - startX + origX;
    var dy = e.clientY - startY + origY;
    var finalX = Math.round(dx);
    var finalY = Math.round(dy);

    console.log('[uni-image-drag] mouseup', { imgSrc: imgSrc ? imgSrc.substring(0,80)+'...' : '(empty)', imgIndex, origX, origY, finalX, finalY, moved: (finalX !== origX || finalY !== origY) });

    if (finalX !== origX || finalY !== origY) {
      window.parent.postMessage({
        source: 'xslt-image-drag',
        imgSrc: imgSrc,
        imageIndex: imgIndex,
        x: finalX,
        y: finalY
      }, '*');
    }
    activeImg = null;
  });
})();
</script>`;
