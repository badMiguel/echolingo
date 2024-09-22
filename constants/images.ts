// apparently dynamic require() is not supported in react native
// thsi is the only way :((
type imageType = {
    [key: string]: string;
}

// todo make sure image are appropriate
const images: imageType = {
    "Feelings and Behaviours": require('../assets/images/health-and-wellbeing.jpg'),
    "Greetings and Checking In": require('../assets/images/audrey-rubuntja-woman-gathering-bush-tucker-200808311339-1024x1024.jpg'),
    // "Others": require('../assets/images/Australian-Aborignial-Art-f5d4a953-b130-4e1d-9a36-e0f07a31112c.png'),
};

export default images;
