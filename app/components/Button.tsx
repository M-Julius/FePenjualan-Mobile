import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { colors } from "../themes/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius:10,
      }}
      onPress={props.onPress}
    >
      <Text style={{ fontWeight: "bold", color: "#fff", paddingVertical: 15 }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
