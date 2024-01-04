function customScroll(divs, manualScrollSpeed = 0, autoScrollSpeed = 75, autoScrollDelay = 2000) {    
    const {scrollArea, rail, knob} = divs;
 
    let knobClicked = false, initialMousePosition = -1, knobTopPosition = 0, currentScrollTop = 0, autoScroll = true,
        intervalId = 0;

    const maxScroll = scrollArea.scrollHeight - scrollArea.offsetHeight;
    const maxKnobTop = rail.offsetHeight - knob.offsetHeight;

    scrollArea.addEventListener('scroll', e => {
        if(knobClicked) return;

        if(manualScrollSpeed == 0) {
            currentScrollTop = scrollArea.scrollTop;
        }
        else if(scrollArea.scrollTop > currentScrollTop) {
            currentScrollTop += manualScrollSpeed;
            if(currentScrollTop > maxScroll) currentScrollTop = maxScroll;
            scrollArea.scrollTop = currentScrollTop;
            
        } else if(scrollArea.scrollTop < currentScrollTop){
            currentScrollTop -= manualScrollSpeed;
            if(currentScrollTop < 0) {
                currentScrollTop = 0;
            }
        }

        setKnobTop();
    });

    scrollArea.addEventListener('wheel', stopScroll);
    scrollArea.addEventListener('click', stopScroll);

    knob.addEventListener('mousedown', () => {
        knob.style.backgroundColor = 'green';
        knobClicked = true;
        stopScroll();
    });

    document.addEventListener('mouseup', () => {
        knob.style.backgroundColor = 'cadetblue';
        knobClicked = false;
        initialMousePosition = -1;
    });

    document.addEventListener('mousemove', e => {
        if(!knobClicked) return;
        if(initialMousePosition == -1) {
            initialMousePosition = e.y
        } else {
            const diff = e.y - initialMousePosition;
            initialMousePosition = e.y;
            knobTopPosition += diff;
            if(knobTopPosition < 0) {
                knobTopPosition = 0;
            } else if(knobTopPosition > maxKnobTop) {
                knobTopPosition = maxKnobTop
            }

            const moveRate = knobTopPosition / maxKnobTop;
            const scrollPosition = maxScroll * moveRate;
            scrollArea.scrollTop = scrollPosition;
            knob.style.top = knobTopPosition + 'px';
        }
    });

    setTimeout(() => {
        if(!autoScroll) return;
        console.log('Starting autoscroll');

        intervalId = setInterval(() => {
            currentScrollTop += 1;
            if(currentScrollTop == maxScroll) {
                stopScroll();
            } 
            scrollArea.scrollTop = currentScrollTop;
            setKnobTop();
        }, autoScrollSpeed)
    }, autoScrollDelay);

    function setKnobTop() {
        knobTopPosition = currentScrollTop * maxKnobTop / maxScroll;
        scrollArea.scrollTop = currentScrollTop;
        knob.style.top = knobTopPosition + 'px';
    }

    function stopScroll() {
        autoScroll = false;
        if(intervalId) {
            clearInterval(intervalId);
        }
    }
}