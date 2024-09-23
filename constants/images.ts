// apparently dynamic require() is not supported in react native
// thsi is the only way :((
type imageType = {
    [key: string]: string;
}

const images: imageType = {
    "Feelings and Behaviours": require('@/assets/images/placeholder.jpg'),
    "Greetings and Checking In": require('@/assets/images/placeholder.jpg'),
};

export default images;
