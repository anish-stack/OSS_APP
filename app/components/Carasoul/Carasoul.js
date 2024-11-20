import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');

export default function Carasoul() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const webViewRefs = useRef([]);

    const data = [
        {
            id: 1, content: (
                <WebView
                    ref={(ref) => (webViewRefs.current[0] = ref)}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    source={{ uri: 'https://www.youtube.com/embed/3ImoDjSemuE?si=EDJyAJ99SytK5-Sl' }}
                />
            ),
        },
        {
            id: 2, content: (
                <WebView
                    ref={(ref) => (webViewRefs.current[1] = ref)}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    source={{ uri: 'https://www.youtube.com/embed/J9tIA3EM41Y?si=fFScso_881k5ILis' }}
                />
            ),
        },
        {
            id: 3,
            content: (
                <WebView
                    ref={(ref) => (webViewRefs.current[2] = ref)}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    source={{ uri: 'https://www.youtube.com/embed/K9RqNkXV6R4?si=KR6wt9H8WrY45_mb' }}
                />
            ),
        },
    ];



    const handleNext = () => {
        pauseVideo(currentIndex);
        const nextIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(nextIndex);
        carouselRef.current.scrollTo({ index: nextIndex, animated: true });
    };

    const handlePrev = () => {
        pauseVideo(currentIndex);
        const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        carouselRef.current.scrollTo({ index: prevIndex, animated: true });
    };

    const pauseVideo = (index) => {
        const webViewRef = webViewRefs.current[index];
        if (webViewRef) {
            webViewRef.injectJavaScript('document.querySelector("video").pause();');
        }
    };
    return (
        <View style={styles.container}>
            <Carousel
                ref={carouselRef}
                width={width}
                height={315} // Height of the carousel
                data={data}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => {
                    if (currentIndex !== index) {
                        pauseVideo(currentIndex);
                    }
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={styles.carouselItem}>
                        {typeof item.content === 'string' ? (
                            <Text style={styles.slideText}>{item.content}</Text>
                        ) : (
                            item.content // Render WebView directly
                        )}
                         <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handlePrev} style={styles.button}>
                                <Icon name="chevron-left" size={12} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNext} style={styles.button}>
                                <Icon name="chevron-right" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
             <View style={styles.dotContainer}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
           
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding:12,
    },
    carouselItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 315, // Same height as the carousel
        position: 'relative', // Position relative for buttons
    },
    webview: {
        height: '100%', // Fill the available height
        width: width, // Fill the available width
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%', // Adjust width as needed
        position: 'absolute',
        top:'50%', // Position buttons at the bottom
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#A7CF44', // Button color
        width:30,
        height:30,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 5,
    },
    activeDot: {
        backgroundColor: '#28834C',
    },
    inactiveDot: {
        backgroundColor: '#ccc',
    },
});
