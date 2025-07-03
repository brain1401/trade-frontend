import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Description } from '@/routes/faq';

type InsideDataProps = {
    descriptions: Description[];
    title: string;
    isActive: boolean;
};

export default function InsideData({ descriptions: description, title, isActive }: InsideDataProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className={cn(isActive ? "block" : "hidden", "p-4 bg-white rounded-lg shadow-md w-full max-w-3xl")}>
            <h1 className="text-xl font-semibold mb-4">{title}</h1>

            <div className="faq-container space-y-3">
                {description.map((question, index) => (
                    <div key={index} className="faq-item border-t pt-2">
                        <div
                            className="faq-question cursor-pointer flex justify-between items-center"
                            onClick={() => handleToggle(index)}
                        >
                            <span className="font-medium">Q{index + 1}. {question.question}</span>
                            <span
                                className={`arrow transform transition-transform duration-300 ${openIndex === index ? "rotate-90" : ""}`}
                            >
                                ▶
                            </span>
                        </div>
                        {openIndex === index && (
                            <div className="faq-answer mt-2 text-gray-700">
                                {question.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
