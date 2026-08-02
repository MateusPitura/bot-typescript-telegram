import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({
    input,
    output,
});

export async function ask(question: string): Promise<string> {
    return rl.question(question);
}