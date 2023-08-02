//code
import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, icons } from '../../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Dashboard = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        //Function to generate a random quote index
        const generateRandomQuoteIndex = (max) => Math.floor(Math.random() * max);

        //sample list of quotes
        const quotes = [
            '"The road to health is paved with good intestines!"',
            '"Sweetness is not in itself unhealthy, we simply eat only the most unhealthy kind of sweetness."',
            '"Every day we live and every meal we eat we influence the great microbial organ inside us - for better or for worse.”',
            '“. . . our body is an ecosystem. This ecosystem must be maintained . . .”',
            '“Your gut is not Las Vegas. What happens in the gut does not stay in the gut.”',
            '“The only bad workout is the one that didn’t happen.”',
            '“Someone busier than you is running right now.”',
            '“Working out is never convenient. But neither is illness, diabetes and obesity!”',
            '"Exercise is king, nutrition is Queen, put them together, and you\'ve got a kingdom."',
        ]

        //Get the current date
        const currentDate = new Date().toDateString();

        // Retrieve the stored date and quote index from AsyncStorage
    AsyncStorage.getItem('lastQuoteDate').then((storedDate) => {
        // If the stored date is different from the current date, generate a new random quote
        if (storedDate !== currentDate) {
          const randomQuoteIndex = generateRandomQuoteIndex(quotes.length);
          setQuote(quotes[randomQuoteIndex]);
  
          // Store the new quote index and current date in AsyncStorage
          AsyncStorage.setItem('lastQuoteIndex', randomQuoteIndex.toString());
          AsyncStorage.setItem('lastQuoteDate', currentDate);
        } else {
          // If the stored date is the same as the current date, retrieve the last quote index and display the same quote
          AsyncStorage.getItem('lastQuoteIndex').then((storedQuoteIndex) => {
            setQuote(quotes[parseInt(storedQuoteIndex)]);
          });
        }
      });
    }, []);

    return (
        <View style={styles.container}>
            <Image source={icons.menu} style={styles.hamburger}/>
            <Text style={styles.title}>
                Welcome User!
            </Text>
            <View style={styles.quoteContainer}>
                <Text style={styles.quote}>
                    {quote}
                </Text>
            </View>
        </View>
        //prognosis
        //chatbot
    )
};
//styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 10,
        paddingTop: 5,
        paddingLeft: 10,
    },
    hamburger: {
        position: 'absolute',
        right: 10,
        height: 40,
        width: 30
    },
    quote: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        color: COLORS.revblue,
        fontWeight: 'bold',
    },
    quoteContainer: {
        backgroundColor: COLORS.white,
        borderRadius:20,
        padding: 5,
        marginTop: 10,
        elevation: 10, // For shadow on Android
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginLeft: 20,
        marginRight: 20,
    }
})

export default Dashboard;