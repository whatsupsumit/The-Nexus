import React, { useState } from "react";

function Faq() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    const faqs = [
        {
            question: "What is NEXUS?",
            answer: (
                <>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        NEXUS is a movie streaming platform where you can watch movies online for free.
                    </p>
                </>
            ),
        },
        {
            question: "Is Nexus free?",
            answer: (
                <>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        Yes! NEXUS is free for everyone.
                    </p>
                </>
            ),
        },
        {
            question: "Does Nexus support 4K streaming?",
            answer: (
                <>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        Yes! Nexus fully supports 4K Ultra HD streaming to give you a
                        sharp, cinematic viewing experience. Whether you're watching movies
                        or bingeing series, you'll enjoy crystal-clear visuals with vibrant
                        colors and smooth playback — as long as your device and internet
                        connection support it.
                    </p>
                </>
            ),
        },
        {
            question: "Is Nexus available on multiple devices?",
            answer: (
                <>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        Absolutely! You can access Nexus on smart TVs, mobile phones, tablets,
                        and web browsers. Your watch history and preferences sync
                        automatically, so you can start a show on one device and continue on
                        another seamlessly.
                    </p>
                </>
            ),
        },
    ];

    return (
        <div className="flex relative px-10 sm:px-0 justify-center items-center text-white w-full h-[500px] py-10">
            <div className="w-full max-w-2xl">
                {faqs.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggle(index)}
                            className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 ${index === 0 ? "rounded-t-xl" : ""
                                }`}
                        >
                            <span>{item.question}</span>
                            <svg
                                className={`w-3 h-3 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                                    }`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                        </button>
                        {openIndex === index && (
                            <div className="p-5 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-40 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-xs text-gray-400">
                        © 2025 NEXUS • Premium Streaming
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Faq;
