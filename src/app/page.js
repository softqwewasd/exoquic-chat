'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  PlusIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
                    <option value="org1" className="bg-gray-900">Organization 1</option>
                    <option value="org2" className="bg-gray-900">Organization 2</option>
                    <option value="org3" className="bg-gray-900">Organization 3</option>
                  </select>
                </div>

                {/* Horizontal Line */}
                <hr className="border-t border-white/20" />

                {/* Users List */}
                <div className="space-y-1">
                  {[
                    { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
                    { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
                  ].map((user) => (
                    <button
                      key={user.name}
                      className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left hover:bg-gray-800 transition-colors duration-200"
                    >
                      <img src={user.avatar} alt="" className="size-8 rounded-full" />
                      <span className="text-white text-sm">{user.name}</span>
                    </button>
                  ))}
                </div>

                {/* Second Horizontal Line */}
                <hr className="border-t border-white/20" />

                {/* Groups Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-white text-sm font-semibold">Groups</h3>
                  <button
                    type="button"
                    className="rounded-full p-1 text-sky-500 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <PlusIcon className="size-5" />
                  </button>
                </div>

                {/* Groups List */}
                <div className="space-y-1">
                  {[
                    'Engineering Team',
                    'Marketing Team',
                    'Sales Team',
                    'Design Team',
                  ].map((group) => (
                    <button
                      key={group}
                      className="w-full rounded-md px-3 py-2 text-left text-white text-sm hover:bg-gray-800 transition-colors duration-200"
                    >
                      {group}
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
          <div className="xl:pl-96">
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 h-screen flex flex-col">
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
                <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-500">
                  <textarea
                    rows={1}
                    className="block w-full resize-none border-0 bg-transparent py-1.5 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Type your message..."
                  />
                  <div className="py-2 pl-3 pr-2" aria-hidden="true">
                    <div className="h-9" />
                  </div>
                  <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <button
                      type="submit"
                      className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="fixed inset-y-0 left-20 hidden w-96 overflow-y-auto border-r border-white/20 px-4 py-6 sm:px-6 lg:px-8 lg:block">
          {/* Organization Dropdown */}
          <div className="relative">
            <select className="w-full bg-gray-900 text-white text-lg font-semibold py-2 px-3 border border-white/20 rounded-md appearance-none cursor-pointer hover:bg-gray-800 transition-colors duration-200">
              <option value="org1" className="bg-gray-900">Organization 1</option>
              <option value="org2" className="bg-gray-900">Organization 2</option>
              <option value="org3" className="bg-gray-900">Organization 3</option>
            </select>
          </div>

          {/* Horizontal Line */}
          <hr className="my-4 border-t border-white/20" />

          {/* Users List */}
          <div className="space-y-1">
            {[
              { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
              { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
            ].map((user) => (
              <button
                key={user.name}
                className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left hover:bg-gray-800 transition-colors duration-200"
              >
                <img src={user.avatar} alt="" className="size-8 rounded-full" />
                <span className="text-white text-sm">{user.name}</span>
              </button>
            ))}
          </div>

          {/* Second Horizontal Line */}
          <hr className="my-4 border-t border-white/20" />

          {/* Groups Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white text-sm font-semibold">Channels</h3>
            <button
              type="button"
              className="rounded-full p-1 text-sky-500 hover:bg-gray-800 transition-colors duration-200"
            >
              <PlusIcon className="size-5" />
            </button>
          </div>

          {/* Groups List */}
          <div className="space-y-1">
            {[
              'Engineering Team',
              'Marketing Team',
              'Sales Team',
              'Design Team',
            ].map((group) => (
              <button
                key={group}
                className="w-full rounded-md px-3 py-2 text-left text-white text-sm hover:bg-gray-800 transition-colors duration-200"
              >
                {group}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
