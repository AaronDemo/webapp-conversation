"use client";
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: object | null;
    setUser: (value: object | null) => void;
    code: string | null;
    setCode: (value: string | null) => void;
    loginWithWeChat: (code: string) => Promise<void>;
    userId: string | null;
};

const AuthContext = createContext<AuthContextType>(null!);

async function getWeChatAccessToken() {
    try {
        const response = await fetch(
            `/api/wechat-proxy/cgi-bin/gettoken?corpid=ww31f12b15e58c1b05&corpsecret=iHoM4HPJGDardHVZxkNOz4sXbzZFgOrmXZd0246VSYw`
        );
        const data = await response.json();

        if (data.errcode !== 0) {
            throw new Error(`Failed to get access token: ${data.errmsg}`);
        }
        console.log('Access Token:', data.access_token);
        return data.access_token;
    } catch (error) {
        console.error('Failed to get access token:', error);
        throw error;
    }
}

async function getWeChatUserInfo(accessToken: string, code: string) {
    const response = await fetch(
        `/api/wechat-proxy/cgi-bin/auth/getuserinfo?access_token=${accessToken}&code=${code}`
    );
    return await response.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('wechat-userId') && !!localStorage.getItem('wechat-code');
        }
        return false;
    });
    const [user, setUser] = useState<object | null>(null);
    const [userId, setUserId] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('wechat-userId') || null;
        }
        return null;
    });

    const loginWithWeChat = useCallback(async (code: string) => {
        try {
            const accessToken = await getWeChatAccessToken();
            const userInfo = await getWeChatUserInfo(accessToken, code);

            setUser(userInfo);
            setIsAuthenticated(true);

            if (userInfo?.userid) {
                setUserId(userInfo.userid);
                console.log('User ID:', userInfo.userid);
                localStorage.setItem('wechat-userId', userInfo.userid);
                localStorage.removeItem('wechat-code');
            }

            localStorage.setItem('wechat-code', code);
        } catch (error) {
            console.error('WeChat login failed:', error);
        }
    }, []);

    const [code, setCode] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('wechat-code') || null;
        }
        return null;
    });

    useEffect(() => {
        if (code && !isAuthenticated) {
            setIsAuthenticated(true);
        }
    }, [userId, code, isAuthenticated]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            code,
            setCode,
            loginWithWeChat,
            userId
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}
