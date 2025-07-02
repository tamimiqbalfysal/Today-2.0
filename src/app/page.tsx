"use client";

import { useState, useMemo } from "react";
import { DollarSign, Users, Percent, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const tipPercentages = [15, 18, 20, 25];

export default function Home() {
  const [bill, setBill] = useState("");
  const [tipSelection, setTipSelection] = useState("15");
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("1");
  const [error, setError] = useState("");

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) {
      setError("Bill amount cannot be negative.");
    } else {
      setError("");
    }
    setBill(value);
  };
  
  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const intValue = parseInt(value, 10);
    if (intValue < 1 && value !== "") {
      setError("Number of people must be at least 1.");
    } else {
      setError("");
    }
    setPeople(value);
  };

  const handleTipButtonClick = (value: string) => {
    setTipSelection(value);
    setCustomTip("");
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTip(value);
    setTipSelection("");
  };
  
  const handleReset = () => {
    setBill("");
    setTipSelection("15");
    setCustomTip("");
    setPeople("1");
    setError("");
  };

  const { totalPerPerson, tipPerPerson } = useMemo(() => {
    const billAmount = parseFloat(bill);
    const numberOfPeople = parseInt(people, 10);
    const tipPercent = parseFloat(customTip || tipSelection);

    if (!billAmount || billAmount <= 0 || !numberOfPeople || numberOfPeople < 1 || !tipPercent || tipPercent < 0) {
      return { totalPerPerson: 0, tipPerPerson: 0 };
    }

    const tipAmount = billAmount * (tipPercent / 100);
    const totalAmount = billAmount + tipAmount;
    const tpp = totalAmount / numberOfPeople;
    const tipp = tipAmount / numberOfPeople;

    return { totalPerPerson: tpp, tipPerPerson: tipp };
  }, [bill, people, tipSelection, customTip]);

  const canReset = bill || people !== "1" || customTip || tipSelection !== "15";

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-5xl font-bold text-primary flex items-center gap-3 justify-center">
          <Calculator className="h-12 w-12" />
          TipSplit
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Calculate tips and split bills with ease</p>
      </div>

      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 space-y-8">
            <div>
              <Label htmlFor="bill" className="text-lg font-medium">Bill Amount</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="bill"
                  type="number"
                  placeholder="0.00"
                  value={bill}
                  onChange={handleBillChange}
                  className="pl-10 text-xl h-12"
                  aria-label="Bill Amount"
                />
              </div>
            </div>

            <div>
              <Label className="text-lg font-medium">Select Tip %</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {tipPercentages.map((p) => (
                  <Button
                    key={p}
                    variant={tipSelection === p.toString() ? "default" : "outline"}
                    onClick={() => handleTipButtonClick(p.toString())}
                    className="h-12 text-lg"
                  >
                    {p}%
                  </Button>
                ))}
                <Input
                  type="number"
                  placeholder="Custom"
                  value={customTip}
                  onChange={handleCustomTipChange}
                  className="h-12 text-lg placeholder:text-muted-foreground"
                  aria-label="Custom Tip Percentage"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="people" className="text-lg font-medium">Number of People</Label>
              <div className="relative mt-2">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="people"
                  type="number"
                  placeholder="1"
                  value={people}
                  onChange={handlePeopleChange}
                  className="pl-10 text-xl h-12"
                  min="1"
                  step="1"
                  aria-label="Number of People"
                />
              </div>
            </div>
             {error && <p className="text-destructive text-center">{error}</p>}
          </div>

          <div className="bg-accent text-accent-foreground p-8 flex flex-col justify-between rounded-bl-xl rounded-br-xl md:rounded-r-xl md:rounded-bl-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-700"
            data-state={bill ? "open" : "closed"}
          >
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-medium">Tip Amount</p>
                  <p className="text-sm opacity-80">/ person</p>
                </div>
                <p className="text-4xl lg:text-5xl font-bold" data-ai-hint="money calculation">${tipPerPerson.toFixed(2)}</p>
              </div>
              <Separator className="bg-accent-foreground/20" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-medium">Total</p>
                  <p className="text-sm opacity-80">/ person</p>
                </div>
                <p className="text-4xl lg:text-5xl font-bold">${totalPerPerson.toFixed(2)}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="w-full mt-8 h-14 text-lg bg-accent-foreground/10 text-accent-foreground hover:bg-accent-foreground/20 border-accent-foreground/20"
              disabled={!canReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>
      <footer className="mt-8 text-center text-muted-foreground">
        <p>Built with ❤️ for easy tipping.</p>
      </footer>
    </main>
  );
}
