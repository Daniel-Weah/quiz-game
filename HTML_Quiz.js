document.addEventListener("DOMContentLoaded", function () {
  // Fetch questions from JSON file
  fetch("../questions.json")
    .then((response) => response.json())
    .then((data) => {
      let questions = data;
      
      // Shuffle questions
      questions = questions.sort(() => Math.random() - 0.5);

      // Selecting all required elements
      const start_btn = document.querySelector(".start_btn button");
      const info_box = document.querySelector(".info_box");
      const exit_btn = info_box.querySelector(".buttons .quit");
      const continue_btn = info_box.querySelector(".buttons .restart");
      const quiz_box = document.querySelector(".quiz_box");
      const result_box = document.querySelector(".result_box");
      const option_list = document.querySelector(".option_list");
      const time_line = document.querySelector("header .time_line");
      const timeText = document.querySelector(".timer .time_left_txt");
      const timeCount = document.querySelector(".timer .timer_sec");

      // If startQuiz button clicked
      start_btn.onclick = () => {
        info_box.classList.add("activeInfo"); // Show info box
      };

      // If exitQuiz button clicked
      exit_btn.onclick = () => {
        info_box.classList.remove("activeInfo"); // Hide info box
      };

      // If continueQuiz button clicked
      continue_btn.onclick = () => {
        info_box.classList.remove("activeInfo"); // Hide info box
        quiz_box.classList.add("activeQuiz"); // Show quiz box
        showQuetions(0); // Calling showQestions function
        queCounter(1); // Passing 1 parameter to queCounter
        startTimer(15); // Calling startTimer function
        startTimerLine(0); // Calling startTimerLine function
      };

      let timeValue = 15;
      let que_count = 0;
      let que_numb = 1;
      let userScore = 0;
      let counter;
      let counterLine;
      let widthValue = 0;
      let userAnswers = [];

      const restart_quiz = result_box.querySelector(".buttons .restart");
      const quit_quiz = result_box.querySelector(".buttons .quit");

      // If restartQuiz button clicked
      restart_quiz.onclick = () => {
        quiz_box.classList.add("activeQuiz"); // Show quiz box
        result_box.classList.remove("activeResult"); // Hide result box
        timeValue = 15;
        que_count = 0;
        que_numb = 1;
        userScore = 0;
        widthValue = 0;
        userAnswers = [];
        showQuetions(que_count); // Calling showQestions function
        queCounter(que_numb); // Passing que_numb value to queCounter
        clearInterval(counter); // Clear counter
        clearInterval(counterLine); // Clear counterLine
        startTimer(timeValue); // Calling startTimer function
        startTimerLine(widthValue); // Calling startTimerLine function
        timeText.textContent = "Time Left"; // Change the text of timeText to Time Left
        next_btn.classList.remove("show"); // Hide the next button
      };

      // If quitQuiz button clicked
      quit_quiz.onclick = () => {
        window.location.reload(); // Reload the current window
      };

      const next_btn = document.querySelector("footer .next_btn");
      const bottom_ques_counter = document.querySelector("footer .total_que");

      // If Next Que button clicked
      next_btn.onclick = () => {
        if (que_count < questions.length - 1) {
          // If question count is less than total question length
          que_count++; // Increment the que_count value
          que_numb++; // Increment the que_numb value
          showQuetions(que_count); // Calling showQestions function
          queCounter(que_numb); // Passing que_numb value to queCounter
          clearInterval(counter); // Clear counter
          clearInterval(counterLine); // Clear counterLine
          startTimer(timeValue); // Calling startTimer function
          startTimerLine(widthValue); // Calling startTimerLine function
          timeText.textContent = "Time Left"; // Change the timeText to Time Left
          next_btn.classList.remove("show"); // Hide the next button
        } else {
          clearInterval(counter); // Clear counter
          clearInterval(counterLine); // Clear counterLine
          showResult(); // Calling showResult function
        }
      };

      // Getting questions and options from array
      function showQuetions(index) {
        const que_text = document.querySelector(".que_text");

        // Creating a new span and div tag for question and option and passing the value using array index
        let que_tag =
          "<span>" +
          questions[index].numb +
          ". " +
          questions[index].question +
          "</span>";
        let option_tag =
          '<div class="option"><span>' +
          questions[index].options[0] +
          "</span></div>" +
          '<div class="option"><span>' +
          questions[index].options[1] +
          "</span></div>" +
          '<div class="option"><span>' +
          questions[index].options[2] +
          "</span></div>" +
          '<div class="option"><span>' +
          questions[index].options[3] +
          "</span></div>";
        que_text.innerHTML = que_tag; // Adding new span tag inside que_tag
        option_list.innerHTML = option_tag; // Adding new div tag inside option_tag

        const option = option_list.querySelectorAll(".option");

        // Set onclick attribute to all available options
        for (let i = 0; i < option.length; i++) {
          option[i].setAttribute("onclick", "optionSelected(this)");
        }
      }

      // Creating the new div tags which for icons
      let tickIconTag =
        '<div class="icon tick"><i class="fas fa-check"></i></div>';
      let crossIconTag =
        '<div class="icon cross"><i class="fas fa-times"></i></div>';

      // If user clicked on option
      optionSelected = (answer) => {
        clearInterval(counter); // Clear counter
        clearInterval(counterLine); // Clear counterLine
        let userAns = answer.textContent; // Getting user selected option
        let correcAns = questions[que_count].answer; // Getting correct answer from array
        const allOptions = option_list.children.length; // Getting all option items

        userAnswers.push({ question: questions[que_count].question, userAns: userAns, correcAns: correcAns });

        if (userAns == correcAns) {
          // If user selected option is equal to array's correct answer
          userScore += 1; // Upgrading score value with 1
          answer.classList.add("correct"); // Adding green color to correct selected option
          answer.insertAdjacentHTML("beforeend", tickIconTag); // Adding tick icon to correct selected option
          console.log("Correct Answer");
          console.log("Your correct answers = " + userScore);
        } else {
          answer.classList.add("incorrect"); // Adding red color to correct selected option
          answer.insertAdjacentHTML("beforeend", crossIconTag); // Adding cross icon to correct selected option
          console.log("Wrong Answer");

          for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) {
              // If there is an option which is matched to an array answer
              option_list.children[i].setAttribute("class", "option correct"); // Adding green color to matched option
              option_list.children[i].insertAdjacentHTML(
                "beforeend",
                tickIconTag
              ); // Adding tick icon to matched option
              console.log("Auto selected correct answer.");
            }
          }
        }
        for (let i = 0; i < allOptions; i++) {
          option_list.children[i].classList.add("disabled"); // Once user select an option then disabled all options
        }
        next_btn.classList.add("show"); // Show the next button if user selected any option
      };

      function showResult() {
        info_box.classList.remove("activeInfo"); // Hide info box
        quiz_box.classList.remove("activeQuiz"); // Hide quiz box
        result_box.classList.add("activeResult"); // Show result box
        const scoreText = result_box.querySelector(".score_text");
        if (userScore > 3) {
          // If user scored more than 3
          // Creating a new span tag and passing the user score number and total question number
          let scoreTag =
            "<span>and congrats! 🎉, You got <p>" +
            userScore +
            "</p> out of <p>" +
            questions.length +
            "</p></span>";
          scoreText.innerHTML = scoreTag; // Adding new span tag inside score_Text
        } else if (userScore > 1) {
          // If user scored more than 1
          let scoreTag =
            "<span>and nice 😎, You got <p>" +
            userScore +
            "</p> out of <p>" +
            questions.length +
            "</p></span>";
          scoreText.innerHTML = scoreTag;
        } else {
          // If user scored less than 1
          let scoreTag =
            "<span>and sorry 😐, You got only <p>" +
            userScore +
            "</p> out of <p>" +
            questions.length +
            "</p></span>";
          scoreText.innerHTML = scoreTag;
        }
      
        // Show user answers and correct answers for review
        let reviewTag = "<h3>Review Your Answers:</h3>";
        userAnswers.forEach((answer, index) => {
          const isCorrect = answer.userAns === answer.correcAns;
          const userAnswerStyle = isCorrect ? "background-color: lightgreen;" : "background-color: red;";
          reviewTag += `<p style="font-weight: bold;">${index + 1}. ${answer.question}</p>`;
          reviewTag += `<p style="${userAnswerStyle}">Your Answer: ${answer.userAns}</p>`;
          reviewTag += `<p>Correct Answer: ${answer.correcAns}</p><hr>`;
        });
        result_box.querySelector(".review_answers").innerHTML = reviewTag;
      }
      
      function startTimer(time) {
        counter = setInterval(timer, 1000);
        function timer() {
          timeCount.textContent = time; // Changing the value of timeCount with time value
          time--; // Decrement the time value
          if (time < 9) {
            // If timer is less than 9
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; // Add a 0 before time value
          }
          if (time < 0) {
            // If timer is less than 0
            clearInterval(counter); // Clear counter
            timeText.textContent = "Time Off"; // Change the time text to time off
            const allOptions = option_list.children.length; // Getting all option items
            let correcAns = questions[que_count].answer; // Getting correct answer from array
            for (let i = 0; i < allOptions; i++) {
              if (option_list.children[i].textContent == correcAns) {
                // If there is an option which is matched to an array answer
                option_list.children[i].setAttribute("class", "option correct"); // Adding green color to matched option
                option_list.children[i].insertAdjacentHTML(
                  "beforeend",
                  tickIconTag
                ); // Adding tick icon to matched option
                console.log("Time Off: Auto selected correct answer.");
              }
            }
            for (let i = 0; i < allOptions; i++) {
              option_list.children[i].classList.add("disabled"); // Once user select an option then disabled all options
            }
            next_btn.classList.add("show"); // Show the next button if user selected any option
          }
        }
      }

      function startTimerLine(time) {
        counterLine = setInterval(timer, 29);
        function timer() {
          time += 1; // Upgrading time value with 1
          time_line.style.width = time + "px"; // Increasing width of time_line with px by time value
          if (time > 549) {
            // If time value is greater than 549
            clearInterval(counterLine); // Clear counterLine
          }
        }
      }

      function queCounter(index) {
        // Creating a new span tag and passing the question number and total question
        let totalQueCounTag =
          "<span><p>" +
          index +
          "</p> of <p>" +
          questions.length +
          "</p> Questions</span>";
        bottom_ques_counter.innerHTML = totalQueCounTag; // Adding new span tag inside bottom_ques_counter
      }
    });
});
