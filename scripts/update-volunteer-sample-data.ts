/**
 * Script to update a volunteer with sample professional data
 * Run with: bun run scripts/update-volunteer-sample-data.ts
 */

import { getCollections } from "../lib/models"
import { ObjectId } from "mongodb"

async function updateVolunteerSampleData() {
  try {
    const { users } = await getCollections()

    // Find a volunteer to update (you can change this email)
    const volunteer = await users.findOne({ 
      role: "volunteer" 
    })

    if (!volunteer) {
      console.log("❌ No volunteer found. Please create a volunteer account first.")
      return
    }

    console.log(`📝 Found volunteer: ${volunteer.name} (${volunteer.email})`)

    // Sample professional data
    const updateData = {
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "Next.js", "TailwindCSS"],
      hourlyRate: 500,
      ngoHourlyRate: 750,
      availability: "flexible" as const,
      successRate: 95,
      responseTime: "< 4 hours",
      currentWorkStatus: "Available for new projects",
      completedProjects: 12,
      activeProjects: 2,
      rating: 4.8,
      bio: "Passionate full-stack developer with 5+ years of experience building impactful web applications. Love contributing to meaningful causes!",
      location: "Mumbai, India",
    }

    // Update the volunteer
    const result = await users.updateOne(
      { _id: volunteer._id },
      { $set: updateData }
    )

    if (result.modifiedCount > 0) {
      console.log("✅ Successfully updated volunteer with sample data!")
      console.log("\nUpdated fields:")
      console.log(`- Title: ${updateData.title}`)
      console.log(`- Skills: ${updateData.skills.join(", ")}`)
      console.log(`- Hourly Rate: ₹${updateData.hourlyRate}/hr`)
      console.log(`- NGO Pays: ₹${updateData.ngoHourlyRate}/hr`)
      console.log(`- Success Rate: ${updateData.successRate}%`)
      console.log(`- Response Time: ${updateData.responseTime}`)
      console.log(`- Current Status: ${updateData.currentWorkStatus}`)
      console.log(`- Projects: ${updateData.completedProjects} completed, ${updateData.activeProjects} active`)
      console.log(`- Rating: ${updateData.rating}/5`)
      console.log("\n🎉 Now check the volunteers page to see the updated card!")
    } else {
      console.log("⚠️  No changes made (data might already be up to date)")
    }

  } catch (error) {
    console.error("❌ Error updating volunteer:", error)
  } finally {
    process.exit(0)
  }
}

// Run the script
updateVolunteerSampleData()
