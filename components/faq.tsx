
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="py-16 md:py-2 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-12 text-neutral-900 dark:text-white">
          Questions? We've got answers.
        </h2>
        <div className="w-full mx-auto px-12">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden transition-all cursor-pointer"
              >
                <AccordionTrigger className="cursor-pointer flex justify-between items-center w-full py-5 px-6 text-left text-lg font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition" style={{textDecoration: "none"}}>
                  <span>{faq.question}</span>
                 
                </AccordionTrigger>
                <AccordionContent className="cursor-pointer px-6 pb-5 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

const faqData = [
  {
    question: "What is OKX best known for?",
    answer:
      "OKX is known for being a leading cryptocurrency exchange platform offering advanced trading features, a wide range of cryptocurrencies, and a user-friendly interface for both beginners and professional traders.",
  },
  {
    question: "Is OKX licensed and regulated in the US?",
    answer:
      "OKX operates with various licenses and regulatory approvals in different jurisdictions. For the most up-to-date information about OKX's regulatory status in the US, please visit our regulatory compliance page.",
  },
  {
    question: "Can I use my bank account to fund and withdraw?",
    answer:
      "Yes, OKX supports bank transfers for deposits and withdrawals in many regions. The available payment methods may vary depending on your location and local regulations.",
  },
];
