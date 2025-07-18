"use client" // Add this directive at the very top

export function getConnectionStatusIcon() {
  // This will be called from the component with the actual status
  return null
}

export function getConnectionStatusText() {
  // This will be called from the component with the actual status
  return ""
}

export function getCategoryColor(category: string) {
  switch (category) {
    case "Diamond":
      return "bg-purple-600"
    case "Platinum":
      return "bg-gray-400"
    case "Gold":
      return "bg-yellow-500"
    case "Silver":
      return "bg-gray-300"
    case "VIP":
      return "bg-purple-800"
    case "Standing":
      return "bg-blue-600"
    default:
      return "bg-gray-500"
  }
}

// New function to get border color class based on category
// Replace the existing `getBorderColorClass` function with the following:
export function getBorderColorClass(category: string) {
  switch (category) {
    case "VIP":
      return "border-yellow-400" // Golden border for VIP
    case "Standing":
      return "border-silver" // Silver border for Standing
    default:
      return "border-yellow-400" // Default to golden for other categories or if category is not matched
  }
}
