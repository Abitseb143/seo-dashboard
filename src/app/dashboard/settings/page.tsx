import { Settings, Bell, Code, Key } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500 mt-2">Manage your SEO Fixer AI configuration and integrations.</p>
            </div>

            <div className="space-y-6">
                {/* Project Setup */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <Settings className="text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800">Project Configuration</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Target URL</label>
                            <input
                                type="text"
                                defaultValue="https://www.synthera.com.au/"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Project Name</label>
                            <input
                                type="text"
                                defaultValue="Synthera Web App"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium text-sm transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}
