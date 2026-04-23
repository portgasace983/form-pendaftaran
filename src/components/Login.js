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
import bg from "../assets/bg.jpeg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔥 akun login
  const adminUser = "admin";
  const adminPass = "test123";

  const handleLogin = () => {
    if (!username || !password) {
      alert("Isi semua field!");
      return;
    }

    if (username === adminUser && password === adminPass) {
      // ✅ simpan login
      localStorage.setItem("isLogin", "true");

      // ✅ langsung ke admin
      navigate("/admin");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <Box
      bgImage={`url(${bg})`}
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="rgba(0,0,0,0.6)"
        minH="100vh"
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          w="320px"
          p={6}
          borderRadius="xl"
          bg="rgba(255,255,255,0.08)"
          backdropFilter="blur(15px)"
          border="1px solid rgba(255,255,255,0.1)"
          color="white"
        >
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              Admin Login
            </Text>

            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="whiteAlpha.200"
                _focus={{ bg: "white", color: "black" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="whiteAlpha.200"
                _focus={{ bg: "white", color: "black" }}
              />
            </FormControl>

            <Button w="full" colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;