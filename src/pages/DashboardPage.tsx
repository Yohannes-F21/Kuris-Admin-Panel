import React from "react";
import { FileText, Edit, Archive } from "lucide-react";
export function DashboardPage() {
  return <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <Edit className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Draft Blogs</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <Archive className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Published Blogs</p>
              <p className="text-2xl font-bold">21</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Blogs</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <h3 className="font-medium">Essential Tips for New Mothers</h3>
                <p className="text-sm text-gray-500">Published 2 days ago</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Published
              </span>
            </div>)}
        </div>
      </div>
    </div>;
}