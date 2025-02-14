"use client";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import * as ww from "@wecom/jssdk";
import { useEffect } from "react";
import { Home } from '../components/base/icons/workflow';
import { useAuth } from '@/context/authContext';
export default function LoginPage() {
    const { code, loginWithWeChat } = useAuth();
    const router = useRouter();
    const initializeWeCom = () => {
        console.log("Initializing WeCom SDK");
        const wwLogin = ww.createWWLoginPanel({
            el: "#ww_login",
            params: {
                login_type: ww.WWLoginType.corpApp,
                appid: "ww31f12b15e58c1b05",
                agentid: "1000136",
                redirect_uri: "https://ai.cticert.com",
                state: "loginState",
                redirect_type: ww.WWLoginRedirectType.callback,
            },
            onCheckWeComLogin({ isWeComLogin }) {
                console.log("[isWeComLogin]", isWeComLogin);
            },
            onLoginSuccess({ code }) {
                console.log({ code });
                // loginWithWeChat(code);
                localStorage.setItem('wechat-code', code);
                router.push('/');
            },
            onLoginFail(err) {
                console.log(err);
            },
        });
        return wwLogin;
    };

    useEffect(() => {
        console.log("Component mounted");
        if (!code) {
            // 如果没有code则初始化企业微信登录
            const wwLogin = initializeWeCom();
            return () => {
                console.log("Component unmounted");
                wwLogin.unmount();
            };
        }
    }, [code]);

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400 via-blue-600 to-indigo-900 animate-gradient-move"></div>
            <div className="absolute inset-0 starfield">
                {[...Array(200)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-[1px] h-[1px] bg-white opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 5 + 2}s`,
                            animationDelay: `${Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>
            <div className="absolute inset-0 animate-particle-move">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
                <div className="w-96 p-8 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_0_60px_15px_rgba(96,165,250,0.1)]">
                    <div id="ww_login" className="w-full min-h-[300px] flex items-center justify-center"></div>
                </div>
            </div>
        </div>
    )
}
