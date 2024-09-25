// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

interface CustomIcon {
    color?: string;
    size: number;
}

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>["name"]>) {
    return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}

export const ClipboardListIcon: React.FC<CustomIcon> = ({ color, size }): React.JSX.Element => {
    return <FontAwesome5 name="clipboard-list" size={size} color={color} />;
};

export const UserIcon: React.FC<CustomIcon> = ({ color, size }): React.JSX.Element => {
    return <Feather name="user" size={size} color={color} />;
};
