import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { styled } from 'nativewind';

const StyledView = styled(View);

const Index = () => {
    return (
        <StyledView className='flex justify-center items-center' >
                <Text> Index</Text>
        </StyledView>
    );
}

export default Index
