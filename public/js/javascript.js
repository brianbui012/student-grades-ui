console.log("JavaScript Connected to App");
const studentRenderDiv = document.getElementById("students");
const inputTag = document.getElementById("input-tag");
const searchByNameInput = document.getElementById("name-search");
const searchByTagInput = document.getElementById("tag-search");

const fetchData = async () => {
  let studentArray;
  try {
    studentArrayJSON = await fetch(
      `https://api.hatchways.io/assessment/students`
    );
    const studentArrayObject = await studentArrayJSON.json();

    studentArray = studentArrayObject.students.map((student) => {
      student["tags"] = [];
      return student;
    });

    renderStudentHTML(studentArray);
    renderSubmitForm(studentArray);
    expandEventListener(studentArray);
  } catch {}

  searchByNameInput.addEventListener("keyup", (e) => {
    const filteredArray = searchParameters(studentArray);
    renderStudentHTML(filteredArray);
    renderSubmitForm(filteredArray);
    expandEventListener(studentArray);
  });

  searchByTagInput.addEventListener("keyup", (e) => {
    const filteredArray = searchParameters(studentArray);
    renderStudentHTML(filteredArray);
    renderSubmitForm(filteredArray);
    expandEventListener(studentArray);
  });
};

function renderStudentHTML(studentArray) {
  let studentHTML = "";
  const reducer = (accumulator, currentValue) =>
    parseInt(accumulator) + parseInt(currentValue);
  studentArray.forEach((student) => {
    //renders tag while filtering ==========
    let tagRenderString = "";
    student.tags.forEach(
      (tag) => (tagRenderString += `<button class="tag" >${tag}</button>`)
    );

    const gradeHTML = renderGrades(student);
    studentHTML += `
        <div class="flex-container">
      
          <div class="image-container">
              <img alt="Student Profile Picture" class="profile" src=${
                student.pic
              }>
          </div>

          <div class="student-container"> 
            
            <div class="bio-header">
                  <h1>${student.firstName.toUpperCase()} ${student.lastName.toUpperCase()}</h1>
                  <div id="${
                    student.email
                  }-expand" class="expand-grades-btn">+</div>
            </div>

            <div class="student-bio">
              <div>Email: ${student.email}</div>
              <div>Company: ${student.company}</div>
              <div>Skill: ${student.skill}</div>
              <div>Average: ${
                student.grades.reduce(reducer) / student.grades.length
              }%</div>

              <div id="${
                student.email
              }-grades" class="grade-container" style="display: none">${gradeHTML}</div>
              <div id="${student.email}-tags">${tagRenderString}</div>
  
              <form class="form">
                <input class="tag-input"id="${
                  student.email
                }" type="text" autocomplete="off" placeholder="Add a tag">
                <button class="submit-button">Submit</button>
              </form>

            </div>
          </div>
        </div>
        `;
  });
  studentRenderDiv.innerHTML = studentHTML;
}

function renderSubmitForm(studentArray) {
  const submitForms = document.getElementsByClassName("form");

  for (let i = 0; i < submitForms.length; i++) {
    submitForms[i].addEventListener("submit", (e) => {
      e.preventDefault();
      const tagInput = e.target[0].value;

      const foundStudent = studentArray.filter(
        (student) => student.email === e.target[0].id
      );
      if (tagInput != "") {
        foundStudent[0].tags.push(tagInput);
      }
      renderTags(foundStudent);
      e.target[0].value = "";
    });
  }
}

function renderTags(student) {
  let renderTags = "";
  student[0].tags.forEach(
    (tag) => (renderTags += `<button class="tag">${tag}</button>`)
  );
  document.getElementById(student[0].email + "-tags").innerHTML = renderTags;
}

function searchParameters(studentArray) {
  const searchTag = document.getElementById("tag-search").value.toLowerCase();
  const searchName = document
    .getElementById("name-search")
    .value.toLowerCase()
    .split(" ");

  const filteredByParameters = studentArray.filter((student) => {
    if (searchName.length === 1) {
      return (
        (student.firstName.toLowerCase().includes(searchName[0]) ||
          student.lastName.toLowerCase().includes(searchName[0])) &&
        (searchTag === "" ||
          student.tags.some((tag) => tag.toLowerCase().includes(searchTag)))
      );
    } else if (searchName.length > 1) {
      return (
        student.firstName.toLowerCase().toLowerCase().includes(searchName[0]) &&
        student.lastName.toLowerCase().includes(searchName[1]) &&
        (searchTag === "" ||
          student.tags.some((tag) => tag.toLowerCase().includes(searchTag)))
      );
    }
  });
  return filteredByParameters;
}

function renderGrades(student) {
  let gradeString = "";

  student.grades.forEach((grade, index) => {
    gradeString += `
    <div class="grades">
      <div>Test ${index + 1}:</div>
      <div>${grade}%</div>
    </div>
    `;
  });
  return gradeString;
}

function expandEventListener(studentArray) {
  const expandBtns = document.getElementsByClassName("expand-grades-btn");
  for (i = 0; i < expandBtns.length; i++) {
    expandBtns[i].addEventListener("click", (e) => {
      const userEmail = e.target.id.split("-")[0];
      const gradeElement = document.getElementById(`${userEmail}-grades`);

      if (gradeElement.style.display === "none") {
        gradeElement.style.display = "block";
        e.target.innerHTML = "-";
      } else {
        gradeElement.style.display = "none";
        e.target.innerHTML = "+";
      }
    });
  }
}

fetchData();
