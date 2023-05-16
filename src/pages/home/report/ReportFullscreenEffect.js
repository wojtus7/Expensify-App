import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withDelay, withTiming, Easing } from 'react-native-reanimated';
import _ from 'lodash';

const styles = StyleSheet.create({
    mainView: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 999,
    },
    animatedText: {
        position: 'absolute',
        color: 'white',
        fontSize: 50,
        width: 200,
        height: 100,
        marginTop: -50,
        marginLeft: -100,
    }
});

const propTypes = {
    shouldPlay: PropTypes.bool.isRequired,
    animatedText: PropTypes.string.isRequired,
};

const propTypes2 = {
    animatedText: PropTypes.string.isRequired,
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const AnimatedText = (props) => {
    const initialXPosition = Math.random() * SCREEN_WIDTH;
    const x = useSharedValue(initialXPosition);
    const y = useSharedValue(Math.random() * SCREEN_HEIGHT + 10);
    const isOnLeft = initialXPosition < SCREEN_WIDTH/2;
    const maxScale = 0.5 + Math.random() * (isOnLeft ? 0.5 : 2);
    const scale = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
            transform: [
                {translateY: y.value},
                {translateX: x.value},
                {scale: scale.value},
            ],
        }))

    useEffect(() => {
        const animationTime = 600 + Math.random() * 1000;
        const initialDelay = 1000 + Math.random() * 1000;

        const initialX = x.value;
        const initialY = y.value;
        
        const offsetX = 50 + Math.random() * 250;
                
        scale.value = withDelay(initialDelay, withSequence(withTiming(maxScale, {duration: animationTime}), withTiming(0, {duration: animationTime})));
        x.value = withDelay(initialDelay, withTiming(initialX + (isOnLeft ? offsetX : -offsetX), {duration: animationTime * 2}));
        y.value = withDelay(initialDelay, withTiming(initialY - Math.random() * 100, {duration: animationTime * 2}));
    }, [])

    return (
        <Animated.Text style={[styles.animatedText, animatedStyle, {
            zIndex: maxScale
        }]}>{props.animatedText}</Animated.Text>
    )
}

AnimatedText.propTypes = propTypes2;


const ReportFullscreenEffect = (props) => {
    if (props.shouldPlay) {
        const animatedTexts = [];
        _.times(80, (i) => {
            animatedTexts.push(<AnimatedText key={`AnimatedFriend${i}`} animatedText={props.animatedText}/>);
        })

        return (
            <View pointerEvents='none' style={styles.mainView}>
                {animatedTexts}
            </View>
        );
    }
    return null;
};

ReportFullscreenEffect.propTypes = propTypes;
ReportFullscreenEffect.displayName = 'ReportFullscreenEffect';

export default ReportFullscreenEffect;
