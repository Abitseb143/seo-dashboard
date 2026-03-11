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

                {/* API & Webhooks */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <Code className="text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800">n8n Automation & API</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Incoming Webhook URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    defaultValue="https://your-domain.com/api/audits/create"
                                    className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 font-mono text-sm"
                                />
                                <button className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg font-medium text-sm transition-colors">
                                    Copy
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Use this URL in your n8n POST request to trigger automated audits.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
