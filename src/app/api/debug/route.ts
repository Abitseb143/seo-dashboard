import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const nodeModulesPath = path.join(process.cwd(), "node_modules");
        const exists = fs.existsSync(nodeModulesPath);
        
        let modules: string[] = [];
        if (exists) {
            modules = fs.readdirSync(nodeModulesPath).filter(m => !m.startsWith(".")).slice(0, 50);
        }

        const puppeteerExists = fs.existsSync(path.join(nodeModulesPath, "puppeteer"));

        return NextResponse.json({
            cwd: process.cwd(),
            nodeModulesExists: exists,
            puppeteerExists,
            sampleModules: modules,
            env: process.env.NODE_ENV,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
