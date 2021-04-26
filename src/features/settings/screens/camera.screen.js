import React, { useRef, useState, useEffect, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";

const ProfileCamera = styled(Camera)`
  width: 100%;
  height: 100%;
`;

const CameraButtonContainer = styled.View`
  flex: 1;
  background-color: transparent;
  justify-content: flex-end;
  align-items: center;
`;

const CameraButtonWrapper = styled.View`
  border-width: 2px;
  border-radius: 50px;
  border-color: white;
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const CameraButton = styled.View`
  border-width: 2px;
  border-radius: 50px;
  border-color: white;
  height: 40px;
  width: 40px;
  background-color: white;
`;

export const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef();
  const { user } = useContext(AuthenticationContext);

  const snap = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      AsyncStorage.setItem(`${user.uid}-photo`, photo.uri);
      navigation.goBack();
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ProfileCamera
      ref={(camera) => (cameraRef.current = camera)}
      type={Camera.Constants.Type.front}
      ratio={"16:9"}
    >
      <CameraButtonContainer>
        <TouchableOpacity onPress={snap}>
          <CameraButtonWrapper>
            <CameraButton />
          </CameraButtonWrapper>
        </TouchableOpacity>
      </CameraButtonContainer>
    </ProfileCamera>
  );
};
