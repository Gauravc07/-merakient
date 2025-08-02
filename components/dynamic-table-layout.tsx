"use client"
import type React from "react"

import type { Table } from "@/lib/supabase"
import { ArrowRight } from "lucide-react" // Import ArrowRight icon
import { getBorderColorClass } from "@/utils/status-helpers" // Import the new helper

interface DynamicTableLayoutProps {
  tables: Table[]
  hoveredTable: string | null
  selectedTable: string | null
  onTableHover: (tableId: string | null) => void
  onTableSelect: (tableId: string) => void
  currentUser: string
}

// Helper component for rendering individual layout elements
const LayoutElement = ({
  id,
  position,
  shape = "rectangle", // "rectangle", "circle", "oval"
  category, // For placeholder tables
  pax, // For placeholder tables
  label, // For static elements like "console", "bar", "entry"
  isEntry = false,
  isStaticLabel = false, // New prop to differentiate static labels from bidable/entry
  tables,
  hoveredTable,
  selectedTable,
  onTableHover,
  onTableSelect,
  currentUser,
}: {
  id: string
  position: React.CSSProperties
  shape?: "rectangle" | "circle" | "oval"
  category?: string
  pax?: string
  label?: string
  isEntry?: boolean
  isStaticLabel?: boolean
  tables: Table[]
  hoveredTable: string | null
  selectedTable: string | null
  onTableHover: (tableId: string | null) => void
  onTableSelect: (tableId: string) => void
  currentUser: string
}) => {
  const tableData = tables.find((t) => t.id === id)
  const isBidable = !!tableData && !isStaticLabel && !isEntry // Ensure it's not a static label or entry point

  const isHovered = hoveredTable === id
  const isSelected = selectedTable === id
  const isCurrentUserWinning = isBidable && tableData?.highest_bidder_username === currentUser

  let baseClasses = `absolute flex flex-col items-center justify-center text-center transition-all duration-200 `
  let contentClasses = `bg-black text-yellow-400 font-bold border ` // Base content classes with border

  // Determine border color dynamically for bidable tables
  let borderColorClass = "border-yellow-400" // Default border for static elements and main container
  if (isBidable && tableData) {
    borderColorClass = getBorderColorClass(tableData.category)
  } else if (isStaticLabel) {
    borderColorClass = "border-platinum" // Static labels can have a platinum border
  }

  contentClasses += `${borderColorClass} ` // Add the determined border class

  if (isEntry) {
    baseClasses += `text-sm text-yellow-400 flex-row items-center `
    contentClasses = `` // No border/background for entry labels
  } else {
    let width = "w-24"
    let height = "h-16"
    if (shape === "circle") {
      width = "w-20"
      height = "h-20"
      contentClasses += `rounded-full `
    } else if (shape === "oval") {
      width = "w-32"
      height = "h-20"
      contentClasses += `rounded-full `
    } else {
      // rectangle
      contentClasses += `rounded-md `
    }
    baseClasses += `${width} ${height} `
  }

  // Add hover/selected/winning effects
  if (isBidable) {
    if (isCurrentUserWinning) {
      contentClasses += "ring-2 ring-green-400 shadow-lg shadow-green-400/30 "
    } else if (isSelected) {
      contentClasses += "ring-2 ring-yellow-300 shadow-lg shadow-yellow-400/40 "
    } else if (isHovered) {
      contentClasses += "shadow-md shadow-yellow-300/20 scale-105 "
    }
  }

  return (
    <div
      className={`${baseClasses} ${contentClasses} ${isBidable ? "cursor-pointer" : ""}`}
      style={position}
      onMouseEnter={() => onTableHover(id)}
      onMouseLeave={() => onTableHover(null)}
      onClick={() => isBidable && onTableSelect(id)} // Only allow selection for bidable tables
    >
      {isEntry ? (
        <>
          {label}
          <ArrowRight className="w-4 h-4 ml-1" />
        </>
      ) : isBidable ? (
        <>
          <div className="text-[10px] leading-tight">{tableData.id.toUpperCase()}</div>
          {/* <div className="text-xs leading-tight">{tableData.category.toUpperCase()}</div> */}
          {/* Removed pax count for bidable tables as requested */}
          {isCurrentUserWinning && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-black"></div>
          )}
          {/* Removed hover popup from here, it will be handled by the dialog */}
        </>
      ) : (
        <>
          <div className={`${id === "vip-ref" || id === "standing-ref" ? "text-base" : "text-lg"} leading-tight`}>
            {label || id.toUpperCase()}
          </div>
          {category && <div className="text-xs leading-tight">{category.toUpperCase()}</div>}
          {pax && <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded mt-1">{pax} PAX</div>}
          {/* Removed hover popup from here, it will be handled by the dialog */}
        </>
      )}
      {/* Common hover popup for all elements (static and bidable) */}
      {hoveredTable === id && (
        <div className="absolute z-30 bg-black border-2 border-yellow-400 text-yellow-400 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-2xl -top-20 left-1/2 transform -translate-x-1/2">
          <div className="font-bold text-center">{isBidable ? tableData.name : label || id}</div>
          {isBidable ? (
            <>
              <div className="font-bold text-center text-green-400">₹{tableData.current_bid.toLocaleString()}</div>
              <div className="text-xs text-center text-yellow-300">
                by {tableData.highest_bidder_username || "No bidder"}
              </div>
            </>
          ) : (
            <div className="text-xs text-center text-yellow-300">
              {isEntry ? "Entry Point" : "Not a bid-able table"}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-400"></div>
        </div>
      )}
    </div>
  )
}

export default function DynamicTableLayout({
  tables,
  hoveredTable,
  selectedTable,
  onTableHover,
  onTableSelect,
  currentUser,
}: DynamicTableLayoutProps) {
  return (
    <div className="relative w-full h-[600px] bg-black rounded-3xl border-4 border-yellow-400 shadow-2xl shadow-yellow-500/20 p-6 overflow-hidden">
      {/* VIP BACK STAGE - Top Center */}
      {/* <LayoutElement
        id="vip-back-stage"
        position={{ top: "5%", left: "50%", transform: "translateX(-50%)", width: "180px", height: "40px" }}
        label="VIP BACK STAGE"
        isStaticLabel={true} // Mark as static label
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      /> */}

      {/* Top Row - VIP and Standing Tables */}
      <LayoutElement
        id="vip1"
        position={{ top: "10%", left: "10%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="standing2"
        position={{ top: "20%", left: "30%", width: "50px", height: "50px" }}
        category="Standing"
        pax="5"
        shape="circle"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="standing3"
        position={{ top: "20%", left: "51%", width: "50px", height: "50px" }}
        category="Standing"
        pax="5"
        shape="circle"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="vip2"
        position={{ top: "10%", left: "75%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />

      {/* Mid-Left and Mid-Right VIP Tables */}
      <LayoutElement
        id="vip3"
        position={{ top: "30%", left: "10%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="vip7"
        position={{ top: "30%", left: "75%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />

      {/* Console and Bar (Oval shapes) */}
      <LayoutElement
        id="console"
        position={{ top: "45%", left: "6%", width: "40px", height: "80px" }}
        shape="oval"
        label="CONSOLE"
        isStaticLabel={true} // Mark as static label
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="bar-oval"
        position={{ top: "45%", left: "78%", width: "120px", height: "80px" }}
        shape="oval"
        label="BAR"
        isStaticLabel={true} // Mark as static label
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />

      {/* Lower-Left VIP Tables */}
      <LayoutElement
        id="vip5"
        position={{ top: "60%", left: "10%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="vip6"
        position={{ top: "75%", left: "10%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />

      {/* Lower-Right Standing and VIP Tables */}
      <LayoutElement
        id="standing1"
        position={{ top: "60%", left: "40%", width: "50px", height: "50px" }}
        category="Standing"
        pax="5"
        shape="circle"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      {/* New VIP table (vip4) placed above standing4 */}
      <LayoutElement
        id="vip4"
        position={{ top: "60%", left: "75%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="vip8"
        position={{ top: "75%", left: "43%", width: "50px", height: "70px" }}
        category="VIP"
        pax="6-8"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="standing4"
        position={{ top: "77%", left: "75%", width: "50px", height: "50px" }}
        category="Standing"
        pax="5"
        shape="circle"
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />

      {/* Entry points */}
      <LayoutElement
        id="entry-top-right"
        position={{ top: "23%", right: "0%", width: "80px", height: "30px" }}
        label="ENTRY"
        isEntry={true}
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
        id="entry-bottom-right"
        position={{ top: "71%", right: "0%", width: "80px", height: "30px" }}
        label="ENTRY"
        isEntry={true}
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      />
      <LayoutElement
  id="vip9"
  position={{ top: "28%", left: "5%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>

<LayoutElement
  id="vip10"
  position={{ top: "28%", left: "16%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>

<LayoutElement
  id="vip11"
  position={{ top: "28%", left: "27%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>

<LayoutElement
  id="vip12"
  position={{ top: "28%", left: "38%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>

<LayoutElement
  id="vip13"
  position={{ top: "28%", left: "49%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>

<LayoutElement
  id="vip14"
  position={{ top: "28%", left: "60%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>

<LayoutElement
  id="vip15"
  position={{ top: "28%", left: "71%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>

<LayoutElement
  id="vip16"
  position={{ top: "28%", left: "82%" }}
  category="VIP"
  pax="6-8"
  tables={tables}
  hoveredTable={hoveredTable}
  selectedTable={selectedTable}
  onTableHover={onTableHover}
  onTableSelect={onTableSelect}
  currentUser={currentUser}
/>


      {/* New static labels at the bottom */}
      {/* <LayoutElement
        id="vip-ref"
        position={{ bottom: "0%", left: "25%", transform: "translateX(-50%)", width: "120px", height: "40px" }}
        label="VIP"
        pax="6-8"
        isStaticLabel={true}
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      /> */}
      {/* <LayoutElement
        id="standing-ref"
        position={{ bottom: "0%", left: "75%", transform: "translateX(-50%)", width: "120px", height: "40px" }}
        label="STANDING"
        pax="5"
        isStaticLabel={true}
        tables={tables}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
        onTableHover={onTableHover}
        onTableSelect={onTableSelect}
        currentUser={currentUser}
      /> */}

      {/* Current User Indicator - Top Right */}
      <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="font-semibold">Your Winning Tables</span>
      </div>

      {/* Live Indicator - Top Left */}
      <div className="absolute top-2 left-2 flex items-center gap-2 text-xs text-red-400">
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <span className="font-semibold">LIVE BIDDING</span>
      </div>
    </div>
  )
}
