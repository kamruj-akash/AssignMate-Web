import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Banknote,
  BadgeCheck,
  CheckCircle2,
  FileText,
  ListChecks,
  Search,
  UploadCloud,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const studentSteps = [
  {
    icon: FileText,
    title: "Post your assignment",
    desc: "Share the topic, budget and deadline.",
  },
  {
    icon: ListChecks,
    title: "Compare bids",
    desc: "Verified experts bid — pick the one you trust.",
  },
  {
    icon: Wallet,
    title: "Pay into escrow",
    desc: "Pay via bKash once you accept a bid. The money is held, not sent.",
  },
  {
    icon: CheckCircle2,
    title: "Review & release",
    desc: "Approve the delivered work and escrow releases the payment.",
  },
];

const expertSteps = [
  {
    icon: BadgeCheck,
    title: "Get verified",
    desc: "Upload your credentials — an admin approves before you bid.",
  },
  {
    icon: Search,
    title: "Browse the open feed",
    desc: "Find assignments that match your expertise and place a bid.",
  },
  {
    icon: UploadCloud,
    title: "Deliver the work",
    desc: "Start once escrow is funded, then submit before the deadline.",
  },
  {
    icon: Banknote,
    title: "Get paid",
    desc: "85% of the escrow is released to you the moment it's approved.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl px-4 py-20">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          How AssignMate works
        </h2>
        <p className="mt-2 text-muted-foreground">
          The same flow, seen from both sides.
        </p>
      </div>
      <Tabs defaultValue="student" className="items-center">
        <TabsList>
          <TabsTrigger value="student">For Students</TabsTrigger>
          <TabsTrigger value="expert">For Experts</TabsTrigger>
        </TabsList>
        <TabsContent value="student" className="w-full">
          <ol className="grid gap-4 sm:grid-cols-2">
            {studentSteps.map((step, i) => (
              <StepCard key={step.title} index={i} {...step} />
            ))}
          </ol>
        </TabsContent>
        <TabsContent value="expert" className="w-full">
          <ol className="grid gap-4 sm:grid-cols-2">
            {expertSteps.map((step, i) => (
              <StepCard key={step.title} index={i} {...step} />
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function StepCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <li className="flex gap-3 rounded-lg border border-border p-4">
      <Icon className="size-5 shrink-0 text-primary" />
      <div>
        <p className="text-sm font-medium">
          {index + 1}. {title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
