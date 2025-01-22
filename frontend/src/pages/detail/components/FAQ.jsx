import { useState } from 'react';

const faqs = [
  {
    question: "配送方式和时间",
    answer: "我们提供免费快递送货服务，订单确认后2-3个工作日内送达。"
  },
  {
    question: "保修政策",
    answer: "产品享有一年保修服务，涵盖制造缺陷和材料问题。"
  },
  {
    question: "退换货政策",
    answer: "14天无理由退换，产品需保持原包装和完好状态。"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">常见问题</h2>
      <dl className="mt-4 space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <dt>
              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-base font-medium text-gray-900">
                  {faq.question}
                </span>
                <span className="ml-6 flex items-center">
                  {openIndex === index ? (
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
            </dt>
            {openIndex === index && (
              <dd className="mt-2 pr-12">
                <p className="text-base text-gray-500">{faq.answer}</p>
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
} 