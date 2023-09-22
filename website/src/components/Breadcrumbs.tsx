"use client"

import React, { useEffect, useState } from "react"
import { getData } from "@/api/getData"
import { apiUrl } from "@/config"
import { $session } from "@/session/session"
import { useDataStore } from "@/state/data"
import { useStore } from "@nanostores/react"
import Uppy from "@uppy/core"
import { DashboardModal } from "@uppy/react"
import Tus from "@uppy/tus"
import {
  ArrowUpCircle,
  LayoutGrid,
  List,
  PlusCircle,
  Table,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { NewFolderDialog } from "@/components/NewFolderDialog"

export function Breadcrumbs() {
  const { selectedFolder, parents, setSelectedFolder, ...store } =
    useDataStore()
  let token = useStore($session)?.token
  const [uppy, setUppy] = useState<Uppy>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  function openModal() {
    setModalOpen(true)
  }

  function refreshData() {
    setModalOpen(false)
    getData().then((d) => {
      store.setFiles(d.files)
      store.setFolders(d.folders)
    })
  }

  useEffect(() => {
    // Create an Uppy instance with custom headers
    console.log("selectedFolder",selectedFolder?.id)
    const uppyInstance = new Uppy({
      id: "uppy1",
      autoProceed: false,
      debug: true,
    }).use(Tus, {
      endpoint: apiUrl + "/files/",
      headers: {
        dir:
          selectedFolder?.id! || store.folders.find((f) => f.name === "/")?.id!,
        Authorization: "Bearer " + token,
      },
    })

    // Store the Uppy instance in state
    setUppy(uppyInstance)

    // Clean up the Uppy instance when the component unmounts
    return () => {
      uppy?.close()
    }
  }, [selectedFolder])
  return (
    <>
      {modalOpen && (
        <DashboardModal
          open={modalOpen}
          uppy={uppy!}
          closeModalOnClickOutside
          animateOpenClose
          browserBackButtonClose
          onRequestClose={refreshData}
        />
      )}
      <div className="flex justify-between">
        <ol className="flex text-lg items-center space-x-1 md:space-x-3">
          <li
            onClick={() => setSelectedFolder(null)}
            className="inline-flex items-center"
          >
            <a
              href="#"
              className="inline-flex items-center font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              My Box
            </a>
          </li>
          {parents.map((parent) => (
            <BreadcrumbItem
              key={parent.id}
              text={
                <a
                  href="#"
                  className="ml-1 font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {parent.name}
                </a>
              }
            />
          ))}
          {selectedFolder && (
            <BreadcrumbItem
              text={
                <span className="ml-1 font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {selectedFolder.name}
                </span>
              }
            />
          )}
        </ol>
        <div className="flex items-center gap-4">
          <NewFolderDialog
            id={
              selectedFolder?.id! ||
              store.folders.find((f) => f.name === "/")?.id!
            }
          />
          <Button onClick={openModal} variant="ghost" className=" flex gap-2">
            <ArrowUpCircle className="scale-125 text-sky-400" /> Upload Files
          </Button>
          <div
            onClick={() => store.setViewAs("list")}
            className={
              store.viewAs === "list"
                ? "text-sky-400"
                : "hover:text-sky-400 " +
                  "cursor-pointer transition-colors duration-300 "
            }
          >
            <Table />
          </div>
          <div
            onClick={() => store.setViewAs("grid")}
            className={
              store.viewAs === "grid"
                ? "text-sky-400"
                : "hover:text-sky-400 " +
                  "cursor-pointer transition-colors duration-300 "
            }
          >
            <LayoutGrid />
          </div>
        </div>
      </div>
    </>
  )
}

function BreadcrumbItem({ text }: { text: any }) {
  return (
    <li className="inline-flex items-center">
      <div className="flex items-center">
        <svg
          className="w-3 h-3 text-gray-400 mx-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 9 4-4-4-4"
          />
        </svg>
        {text}
      </div>
    </li>
  )
}