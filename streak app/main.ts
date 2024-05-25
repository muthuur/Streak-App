interface Habit {
  name: string;
  description: string;
  startDate: string;
  imageUrl: string;
}

const habitForm = document.getElementById("habits-form") as HTMLFormElement;
const habitList = document.getElementById("habits-list") as HTMLUListElement;
const habitDetails = document.getElementById(
  "habits-details"
) as HTMLDivElement;

let habits: Habit[] = [];

document.addEventListener("DOMContentLoaded", fetchHabits);

habitForm.addEventListener("submit", createHabit);

async function fetchHabits(): Promise<void> {
  try {
    const response = await fetch("http://localhost:3003/habits");
    habits = await response.json();
    console.log("habits", habits);
    renderHabits();
  } catch (error) {
    console.error("Failed to fetch habits:", error);
  }
}

async function createHabit(e: Event): Promise<void> {
  e.preventDefault();
  const habitName = (document.getElementById("habit-name") as HTMLInputElement)
    .value;
  const habitDescription = (
    document.getElementById("habit-description") as HTMLInputElement
  ).value;
  const startDate = (document.getElementById("startDate") as HTMLInputElement)
    .value;
  const imageUrl = (document.getElementById("imageUrl") as HTMLInputElement)
    .value;

  if (habitName && habitDescription && startDate && imageUrl) {
    const habit: Habit = {
      name: habitName,
      description: habitDescription,
      startDate,
      imageUrl,
    };

    try {
      const response = await fetch("http://localhost:3003/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habit),
      });
      const newHabit = await response.json();
      habits.push(newHabit);
      renderHabits();
      habitForm.reset();
    } catch (error) {
      console.error("Failed to create habit:", error);
    }
  }
}

function renderHabits(): void {
  habitList.innerHTML = "";
  habits.forEach((habit) => {
    const habitItem = document.createElement("li");
    habitItem.classList.add("habit-item");
    const image = document.createElement("img");
    const name = document.createElement("p");
    const startDate = document.createElement("p");
    const streak = document.createElement("p");

    habitItem.classList.add("habits-item");
    image.setAttribute("src", habit.imageUrl);
    image.setAttribute("alt", habit.name);
    name.textContent = habit.name;
    startDate.textContent = habit.startDate;
    streak.textContent = "Streak: " + checkTime(habit.startDate);

    habitItem.appendChild(image);
    habitItem.appendChild(name);
    habitItem.appendChild(startDate);
    habitItem.appendChild(streak);
    habitList.appendChild(habitItem);
  });

  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const habitId = (e.target as HTMLButtonElement).dataset.id;
      if (habitId) {
        viewHabitDetails(parseInt(habitId));
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const habitId = (e.target as HTMLButtonElement).dataset.id;
      if (habitId) {
        deleteHabit(parseInt(habitId));
      }
    });
  });
}

async function viewHabitDetails(habitId: number): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3003/habits/${habitId}`);
    const habit = await response.json();
    if (habit) {
      habitDetails.innerHTML = `
        <h3>${habit.name}</h3>
        <p>${habit.description}</p>
      `;
    } else {
      habitDetails.innerHTML = "<p>Habit not found.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch habit details:", error);
  }
}

async function deleteHabit(habitId: number): Promise<void> {
  try {
    await fetch(`http://localhost:3003/habits/${habitId}`, {
      method: "DELETE",
    });
    renderHabits();
  } catch (error) {
    console.error("Failed to delete habit:", error);
  }
}

// Make functions available globally
(window as any).viewHabitDetails = viewHabitDetails;
(window as any).deleteHabit = deleteHabit;

function checkTime(time: string): string {
  let today: Date = new Date();
  let startDate: Date = new Date(time);
  let timeMiliseconds: number = today - startDate;
  let years: number = 0;
  let months: number = 0;
  let days: number = 0;
  let timeDiff: string = "";

  while (timeMiliseconds > 365 * 24 * 60 * 60 * 1000) {
    timeMiliseconds -= 365 * 24 * 60 * 60 * 1000;
    years += 1;
  }
  while (timeMiliseconds > 30 * 24 * 60 * 60 * 1000) {
    timeMiliseconds -= 30 * 24 * 60 * 60 * 1000;
    months += 1;
  }
  while (timeMiliseconds > 24 * 60 * 60 * 1000) {
    timeMiliseconds -= 24 * 60 * 60 * 1000;
    days += 1;
  }
  years ? (timeDiff += years + " years ") : null;
  months ? (timeDiff += months + " months ") : null;
  timeDiff += days + (days > 1 ? " days" : " day");
  console.log(timeDiff);
  return timeDiff;
}
