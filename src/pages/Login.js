import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import "../css/login.css"; // 🔥 hanya mobile

import bgDesktop from "../assets/bgdesk.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Isi semua field!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      alert("Login gagal: " + error.message);
    }
  };

  return (
    <Box
      className="login-wrapper"
      bgImage={`url(${bgDesktop})`} // ✅ DESKTOP BG
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      position="relative"
    >
      {/* overlay DESKTOP */}
      <Box
        position="absolute"
        w="100%"
        h="100%"
        bg="rgba(0,0,0,0.5)"
        zIndex="1"
      />

      {/* content */}
      <Box
        position="relative"
        zIndex="2"
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
      >
        <Box
          className="login-card"
          w="100%"
          maxW="320px"
          p={6}
          borderRadius="2xl"
          bg="rgba(255,255,255,0.1)"  // ✅ DESKTOP STYLE
          border="1px solid rgba(255,255,255,0.2)"
          color="white"
        >
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              Admin Login 🔐
            </Text>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-login"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-login"
              />
            </FormControl>

            <Button
              w="100%"
              colorScheme="blue"
              onClick={handleLogin}
            >
              Login
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;