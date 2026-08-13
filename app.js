const submitBtn = document.querySelector("#submit");
const studentName = document.querySelector("#name");
const studentAge = document.querySelector("#age");
const studentCourse = document.querySelector("#course");
const studentEmail = document.querySelector("#email");
const studentCity = document.querySelector("#city");
const tableBody = document.querySelector("#tableBody");
const supabaseUrl = "https://piuwjiifsluzggzojhuz.supabase.co";
const supabaseKey = "sb_publishable_mfss4b_IaFPV7gB9OPXp-A_rIwnB6hW";
const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

// form submission
submitBtn &&
  submitBtn.addEventListener("click", async (event) => {
    try {
      event.preventDefault();
      if (
        !studentName.value ||
        !studentAge.value ||
        !studentEmail.value ||
        !studentCourse.value ||
        !studentCity.value
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill the all required information",
        });
        return;
      }
      // create
      const { error } = await client.from("student_data").insert([
        {
          name: studentName.value,
          age: studentAge.value,
          email: studentEmail.value,
          course: studentCourse.value,
          city: studentCity.value,
        },
      ]);
      Swal.fire({
        title: "Data submitted successfully!",
        icon: "success",
        draggable: true,
      });
      studentName.value = "";
      studentAge.value = "";
      studentCourse.value = "";
      studentEmail.value = "";
      studentCity.value = "";
    } catch (error) {
      console.log(error);
    }
  });

// students list
if (window.location.pathname == "/students.html") {
  const getAllStudents = async () => {
    try {
      tableBody.innerHTML = "";
      // read
      const { data } = await client
        .from("student_data")
        .select()
        .order("id", { ascending: true });

      data.forEach((student) => {
        tableBody.innerHTML += `<tr>
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.email}</td>
      <td>${student.course}</td>
      <td>${student.city}</td>
      <td class="btns p-0"><button class="edit px-2 rounded-1" onclick="update(${student.id})"><i class="fa-regular fa-pen-to-square fa-sm " style="color: rgb(99, 44, 255);"></i> edit</button> <button class="dlt px-2 rounded-1" onclick="removeStudent(${student.id})"><i class="fa-regular fa-trash-can fa-sm " style="color: rgb(255, 0, 0);"></i> delete</button></td>
      </tr>`;
      });
      // edit
      window.update = async (id) => {
        const { data } = await client
          .from("student_data")
          .select()
          .eq("id", id);
        let { name, course, email, age, city } = data[0];

        const { value: formValues } = await Swal.fire({
          title: "Update your details below.",
          html: `
    Name: <input id="swal-input1" class="swal1-input" value="${name}"><br/><br/>
    Age: <input id="swal-input2" class="swal1-input" value="${age}"><br/><br/>
    Email: <input id="swal-input3" class="swal1-input" value="${email}"><br/><br/>
    Course: <input id="swal-input4" class="swal1-input" value="${course}"><br/><br/>
    City: <input id="swal-input5" class="swal1-input" value="${city}">
    `,
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById("swal-input1").value,
              document.getElementById("swal-input2").value,
              document.getElementById("swal-input3").value,
              document.getElementById("swal-input4").value,
              document.getElementById("swal-input5").value,
            ];
          },
        });

        if (formValues) {
          const updatedData = {
            name: formValues[0],
            age: formValues[1],
            email: formValues[2],
            course: formValues[3],
            city: formValues[4],
          };
          // update
          const { error } = await client
            .from("student_data")
            .update(updatedData)
            .eq("id", id);
          getAllStudents();
        }
      };

      // delete
      window.removeStudent = async (id) => {
        const { error } = await client
          .from("student_data")
          .delete()
          .eq("id", id);

        Swal.fire({
  title: "Deleted Successfully!",
  icon: "success",
  draggable: true
});

        getAllStudents();
      };
    } catch (error) {
      console.log(error);
    }
  };
  getAllStudents();
}
