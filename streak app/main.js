"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const habitForm = document.getElementById("habits-form");
const habitList = document.getElementById("habits-list");
const habitDetails = document.getElementById("habits-details");
let habits = [];
document.addEventListener("DOMContentLoaded", fetchHabits);
habitForm.addEventListener("submit", createHabit);
function fetchHabits() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:3003/habits");
            habits = yield response.json();
            console.log("habits", habits);
            renderHabits();
        }
        catch (error) {
            console.error("Failed to fetch habits:", error);
        }
    });
}
function createHabit(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const habitName = document.getElementById("habit-name")
            .value;
        const habitDescription = document.getElementById("habit-description").value;
        const startDate = document.getElementById("startDate")
            .value;
        const imageUrl = document.getElementById("imageUrl")
            .value;
        if (habitName && habitDescription && startDate && imageUrl) {
            const habit = {
                name: habitName,
                description: habitDescription,
                startDate,
                imageUrl,
            };
            try {
                const response = yield fetch("http://localhost:3003/habits", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(habit),
                });
                const newHabit = yield response.json();
                habits.push(newHabit);
                renderHabits();
                habitForm.reset();
            }
            catch (error) {
                console.error("Failed to create habit:", error);
            }
        }
    });
}
function renderHabits() {
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
            const habitId = e.target.dataset.id;
            if (habitId) {
                viewHabitDetails(parseInt(habitId));
            }
        });
    });
    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const habitId = e.target.dataset.id;
            if (habitId) {
                deleteHabit(parseInt(habitId));
            }
        });
    });
}
function viewHabitDetails(habitId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3003/habits/${habitId}`);
            const habit = yield response.json();
            if (habit) {
                habitDetails.innerHTML = `
        <h3>${habit.name}</h3>
        <p>${habit.description}</p>
      `;
            }
            else {
                habitDetails.innerHTML = "<p>Habit not found.</p>";
            }
        }
        catch (error) {
            console.error("Failed to fetch habit details:", error);
        }
    });
}
function deleteHabit(habitId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetch(`http://localhost:3003/habits/${habitId}`, {
                method: "DELETE",
            });
            renderHabits();
        }
        catch (error) {
            console.error("Failed to delete habit:", error);
        }
    });
}
// Make functions available globally
window.viewHabitDetails = viewHabitDetails;
window.deleteHabit = deleteHabit;
function checkTime(time) {
    let today = new Date();
    let startDate = new Date(time);
    let timeMiliseconds = today - startDate;
    let years = 0;
    let months = 0;
    let days = 0;
    let timeDiff = "";
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
