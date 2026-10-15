// 3D Parallax Card Tilt & Scroller Helpers
window.tiltCard3D = function(e, cardEl) {
            if (!cardEl) return;
            const rect = cardEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -9;
            const rotY = ((x - cx) / cx) * 9;
            cardEl.style.transform = 'perspective(1100px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateY(-6px) scale(1.015)';
        };

        window.resetCard3D = function(cardEl) {
            if (!cardEl) return;
            cardEl.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        };

        window.scrollModeCards = function(dir) {
            const scroller = document.getElementById('godless-scroller');
            if (scroller) {
                scroller.scrollBy({ left: dir * 350, behavior: 'smooth' });
            }
        };
