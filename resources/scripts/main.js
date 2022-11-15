var app = {}

import $ from 'jquery'
import { Howl, Howler } from 'howler'

import musicMp3 from '../audio/music.mp3'
import ringMp3 from '../audio/ring.mp3'

app.emeraldHill = (function () {
    'use strict';

    var getOffsetResult,
        getOffsetResultY,
        direction,
        speedClass = '',
        jumping,
        boredClock,
        $container = $('#container');

    var getOffset = function (e) {


        var $outputEl = $('#position'),
            $offsetElem = $('#center');

        // for debug box
        $('#input-type').text(e.type);

        // determine whether mouse or touch
        if (e.type === 'touchmove') {
            var e = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        }

        getOffsetResultY = Math.floor((e.pageY - ($offsetElem.offset().top)) / window.innerHeight * 100);


        $outputEl.text(
            ' x ' + Math.floor((e.pageX - ($offsetElem.offset().left)) / window.innerWidth * 100)
            + ' y ' + getOffsetResultY
        )

        return Math.floor((e.pageX - $offsetElem.offset().left) / window.innerWidth * 100);
    };

    var background = function () {

        var $backgroundLayers = $('.background-wrapper');

        // initiate all background elements at 0
        var skySpd = 0,
            mntHighSpd = 0,
            mntLowSpd = 0,
            tile1spd = 0,
            tile2spd = 0,
            tile3spd = 0,
            tile4spd = 0,
            tile5spd = 0,
            platformSpd = 0,
            scroller;

        var setBackgroundSpeeds = function () {

            // do not move bg if we're below sonic animation threshold
            if (Math.abs(getOffsetResult) < 5) return;


            platformSpd -= (getOffsetResult / 10) * 1.65;
            $('.platform-wrapper').css({
                'transform': 'translate3d(' + platformSpd + 'px,0,0)'
            });

            skySpd -= (getOffsetResult / 10) * 0.1;
            $backgroundLayers.find('.sky-wrapper').css({
                '-webkit-transform': 'translate3d(' + skySpd + 'px,0,0)'
            });

            mntHighSpd -= (getOffsetResult / 10) * 0.3;
            $backgroundLayers.find('.mountains').css({
                'transform': 'translate3d(' + mntHighSpd + 'px,0,0)'
            });

            mntLowSpd -= (getOffsetResult / 10) * 0.35;
            $backgroundLayers.find('.mountains-lower').css({
                'transform': 'translate3d(' + mntLowSpd + 'px,0,0)'
            });

            tile1spd -= (getOffsetResult / 10) * 0.7;
            $backgroundLayers.find('.tile-1').css({
                'transform': 'translate3d(' + tile1spd + 'px,0,0)'
            });

            tile2spd -= (getOffsetResult / 10) * 0.9;
            $backgroundLayers.find('.tile-2').css({
                'transform': 'translate3d(' + tile2spd + 'px,0,0)'
            });

            tile3spd -= (getOffsetResult / 10) * 1.1;
            $backgroundLayers.find('.tile-3').css({
                'transform': 'translate3d(' + tile3spd + 'px,0,0)'
            });

            tile4spd -= (getOffsetResult / 10) * 1.3;
            $backgroundLayers.find('.tile-4').css({
                'transform': 'translate3d(' + tile4spd + 'px,0,0)'
            });
            /*
                    tile5spd -= (getOffsetResult / 10) * 1.2;

                    $backgroundLayers.find('.tile-5').css({
                    'transform': 'translate3d(' + tile5spd + 'px,0,0)'
                    });*/

        }

        // request animation frame loop
        // https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/

        var touched = false;
        var running;

        function animLoop(render, element) {
            var lastFrame = +new Date;
            function loop(now) {
                // stop the loop if render returned false
                if (running !== false) {
                    requestAnimationFrame(loop, element);
                    running = render(now - lastFrame);
                    lastFrame = now;
                }
            }
            loop(lastFrame);
        }


        $(document).on('mousemove touchmove', function () {

            // prevent this function running on every single movement of the cursor/touch
            if (touched) return;

            touched = true;
            running = true;

            animLoop(function () {
                setBackgroundSpeeds();
            });

        }).on('touchend mouseleave', function (e) {

            // reset all values
            // if jumping, wait a sec, otherwise sonic will return to normal running state mid-air

            if (jumping) {
                setTimeout(function () {

                    speedClass = '';
                    $container.removeClass();
                }, 600);
            } else {
                speedClass = '';
                $container.removeClass();
            }

            touched = false;
            running = false;
            bored();
            getOffsetResultY = 0;

        });

    };

    var music = function () {

        Howler.mute();

        var sound = new Howl({
            urls: [musicMp3],
            autoplay: true,
            loop: true
        });


        var muted = true,
            $muteToggle = $('#mute-toggle');

        $muteToggle.on('click', function (e) {

            e.preventDefault();

            if (muted) {
                Howler.unmute();
                muted = false;
                $muteToggle.addClass('active');
            } else {
                Howler.mute();
                muted = true;
                $muteToggle.removeClass('active');
            }

        });

    };

    var panels = function () {

        var panelVisible = false,
            $infoPanel = $('#info-panel');

        $('#info-toggle').on('click', function () {

            if (panelVisible) {
                $infoPanel.hide();
                panelVisible = false;
            } else {
                $infoPanel.show();
                panelVisible = true;
            }

        })

        // hide panels on click

        $('.panel').on('click', function () {
            $(this).hide();
            panelVisible = false;
        });

        // cheats

        console.log('Remember the level select code?');

        var keys = [],
            cheatCode = '49,57,54,53,57,49,55',
            cheatCodeNumpad = '97,105,102,101,105,97,103',
            comboMap = [],
            comboDown = [],
            perspective = false,
            soundRing = new Howl({
                urls: [ringMp3]
            });


        $(document).keydown(function (e) {

            keys.push(e.keyCode);

            if (keys.toString().indexOf(cheatCode) >= 0 || keys.toString().indexOf(cheatCodeNumpad) >= 0) {

                // trigger audio
                soundRing.play();

                //$('body').addClass('perspective');
                $('#debug').show();

                // reset the code
                keys = [];

                console.log('Debug box active!')

            }


            if (!comboMap[e.keyCode]) {
                comboDown.push(e.keyCode);
                if (comboDown[0] === 65 && comboDown[1] === 13) {

                    if (perspective) {
                        $('body').addClass('perspective');
                        perspective = false;
                        console.log('Perspective mode active!')

                        soundRing.play();


                    } else {
                        $('body').removeClass('perspective');
                        perspective = true;
                    }

                    // reset the combo
                    comboMap = [];
                    comboDown = [];

                }
            }
            comboMap[e.keyCode] = true;

        }).keyup(function (e) {
            comboMap[e.keyCode] = false;
            comboDown.length = 0;
        });

    };


    return {
        background: background,
        music: music,
        panels: panels
    };

}());


// initialise modules
app.emeraldHill.background();
app.emeraldHill.music();
app.emeraldHill.panels();