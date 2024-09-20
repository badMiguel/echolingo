// apparently dynamic require() is not supported in react native
// thsi is the only way :((
type imageType = {
    [key: string]: string;
}

const images: imageType = {
    "Feelings and Behaviours": require('../assets/images/health-and-wellbeing.jpg'),
    "Greetings and Checking In": require('../assets/images/audrey-rubuntja-woman-gathering-bush-tucker-200808311339-1024x1024.jpg'),
};

export default images;
