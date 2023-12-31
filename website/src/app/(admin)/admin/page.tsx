"use client"

import Link from "next/link"
import { adminOverview } from "@/api/adminOverview"
import { grafanaUrl } from "@/config"
import { queryKeys } from "@/queryKeys"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpRightIcon, Database, FileIcon, UsersIcon } from "lucide-react"

import { bytesToMB } from "@/lib/utils"
import { Spinner } from "@/components/Spinner"

import { AdminCard } from "./AdminCard"

const dashboardData = [
  {
    title: "CPU",
    links: [
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=5s&panelId=305",
        width: "450px",
        height: "200px",
      },
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=5s&panelId=3",
        width: "450px",
        height: "200px",
      },
    ],
  },
  {
    title: "Network",
    links: [
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=5s&panelId=290",
        width: "450px",
        height: "200px",
      },
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=5s&panelId=126",
        width: "450px",
        height: "200px",
      },
    ],
  },
  {
    title: "RAM",
    links: [
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=5s&panelId=78",
        width: "450px",
        height: "200px",
      },
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=5s&panelId=16",
        width: "450px",
        height: "200px",
      },
    ],
  },
  {
    title: "Storage",
    links: [
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=5s&panelId=127",
        width: "450px",
        height: "200px",
      },
      {
        src:
          grafanaUrl +
          "/d-solo/rYdddlPWk/node-exporter-full?orgId=1&panelId=156",
        width: "450px",
        height: "200px",
      },
    ],
  },
]
export default function Page() {
  const query = useQuery({
    queryKey: [queryKeys.overview],
    queryFn: adminOverview,
  })

  if (query.isLoading)
    return (
      <div className="p-96 mx-auto">
        <Spinner />
      </div>
    )
  return (
    <section className="p-4 flex flex-col items-center gap-2">
      <h2 className="text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Overview
      </h2>
      <div className="flex gap-8">
        <Link href="/admin/users">
          <AdminCard
            icon={<UsersIcon className="w-14 h-14  rounded-sm p-2" />}
            text1="Users"
            text2={query.data?.userCount.toString() || "0"}
          />
        </Link>
        <Link href="#">
          <AdminCard
            icon={<Database className="w-14 h-14  rounded-sm p-2" />}
            text1="Storage Used"
            text2={bytesToMB(query.data?.totalStorage || 0)}
          />
        </Link>
        <Link href="/admin/users">
          <AdminCard
            icon={<FileIcon className="w-14 h-14  rounded-sm p-2" />}
            text1="Files"
            text2={query.data?.fileCount.toString() || "0"}
          />
        </Link>
      </div>
      <EmbeddedDashboard data={dashboardData} />
    </section>
  )
}
type DashboardDataItem = {
  title: string
  links: {
    src: string
    width: string
    height: string
  }[]
}
function EmbeddedDashboard({ data }: { data: DashboardDataItem[] }) {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <h2 className="font-bold text-lg">{item.title}</h2>
          <div className="flex gap-4 p-2">
            {item.links.map((link, linkIndex) => (
              <div key={linkIndex} className="flex flex-col">
                <iframe
                  src={link.src}
                  width={link.width}
                  height={link.height}
                ></iframe>
                <a
                  href={link.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 flex underline hover:underline-offset-1 hover:text-blue-500/80"
                >
                  New Tab <ArrowUpRightIcon />
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
