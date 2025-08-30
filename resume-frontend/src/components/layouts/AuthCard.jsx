import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AuthCard({ children, title }) {
  return (
    <Card className="max-w-md mx-auto mt-16 shadow-lg">
      <CardHeader className="text-center text-xl font-bold mb-2">
        {title}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
