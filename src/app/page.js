'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useOrganizations } from '@/hooks/useOrganizations'
import { useOrganizationMembers } from '@/hooks/useOrganizationMembers'
import { useTeams } from '@/hooks/useTeams'
import { useCurrentOrganization } from '@/hooks/useCurrentOrganization'


export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const organizations = useOrganizations();
  const members = useOrganizationMembers(organizations[0]?.id);
  const teams = useTeams(organizations[0]?.id);
  const { currentOrganization, setCurrentOrganization } = useCurrentOrganization();

  useEffect(() => {
    if (!currentOrganization && organizations.length > 0) {
      setCurrentOrganization(organizations[0]);
    }
  }, [currentOrganization, organizations]);

  console.log("This is the current organization", currentOrganization);

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                {/* Organization Dropdown */}
                <div className="relative pt-5">
                  <select className="w-full bg-gray-900 text-white text-lg font-semibold py-2 px-3 border border-gray-700 rounded-md appearance-none cursor-pointer hover:bg-gray-800 transition-colors duration-200">
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id} className="bg-gray-900">{org.login}</option>
                    ))}
                  </select>
                </div>

                {/* Horizontal Line */}
                <hr className="border-t border-white/20" />

                {/* Users List */}
                <div className="space-y-1">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left hover:bg-gray-800 transition-colors duration-200"
                    >
                      <img src={member.avatar_url} alt="" className="size-8 rounded-full" />
                      <span className="text-white text-sm">{member.login}</span>
                    </button>
                  ))}
                </div>

                {/* Second Horizontal Line */}
                <hr className="border-t border-white/20" />

                {/* Groups Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-white text-sm font-semibold">Groups</h3>
                </div>

                {/* Groups List */}
                <div className="space-y-1">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      className="w-full rounded-md px-3 py-2 text-left text-white text-sm hover:bg-gray-800 transition-colors duration-200"
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>


        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-400 lg:hidden">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-white">Dashboard</div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="size-8 rounded-full bg-gray-800"
            />
          </a>
        </div>

        <main className="lg:pl-20">
          <div className="lg:pl-96">
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 h-screen flex flex-col">
              {/* Chat Header */}
              <div className="pb-4 mb-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  {/* Avatar (for user chats) */}
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    className="size-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-white">John Doe</h2>
                    <p className="text-sm text-gray-400">Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {/* Example messages - you'll want to map through your actual messages */}
                {/* Received Message */}
                <div className="flex items-start space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    className="size-8 rounded-full"
                  />
                  <div className="bg-slate-400 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                    <p className="text-gray-900">This is a received message</p>
                  </div>
                </div>

                {/* Sent Message */}
                <div className="flex justify-end">
                  <div className="bg-sky-500 rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                    <p className="text-white">This is a sent message</p>
                  </div>
                </div>
              </div>

              {/* Chat Input Area */}
              <div className="border-t border-gray-200 px-4 py-4 sm:mb-0">
                <div className="relative overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-500">
                  <textarea
                    rows={2}
                    className="block w-full resize-none border-0 bg-transparent py-3 px-3 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Type your message... (Press Enter to send)"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="fixed inset-y-0 left-20 hidden w-96 overflow-y-auto border-r border-white/20 px-4 py-6 sm:px-6 lg:px-8 lg:block">
          {/* Organization Dropdown */}
          <div className="relative">
            <select className="w-full bg-gray-900 text-white text-lg font-semibold py-2 px-3 border border-white/20 rounded-md appearance-none cursor-pointer hover:bg-gray-800 transition-colors duration-200">
              {organizations.map((org) => (
                <option key={org.id} value={org.id} className="bg-gray-900">{org.login}</option>
              ))}
            </select>
          </div>

          {/* Horizontal Line */}
          <hr className="my-4 border-t border-white/20" />

          {/* Users List */}
          <div className="space-y-1">
            {members.map((member) => (
              <button
                key={member.id}
                className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left hover:bg-gray-800 transition-colors duration-200"
              >
                <img src={member.avatar_url} alt="" className="size-8 rounded-full" />
                <span className="text-white text-sm">{member.login}</span>
              </button>
            ))}
          </div>

          {/* Second Horizontal Line */}
          <hr className="my-4 border-t border-white/20" />

          {/* Groups Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white text-sm font-semibold">Channels</h3>
          </div>

          {/* Groups List */}
          <div className="space-y-1">
            {teams.map((team) => (
              <button
                key={team.id}
                className="w-full rounded-md px-3 py-2 text-left text-white text-sm hover:bg-gray-800 transition-colors duration-200"
              >
                {team.name}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
