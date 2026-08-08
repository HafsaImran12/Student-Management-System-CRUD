const supabaseUrl = "https://piuwjiifsluzggzojhuz.supabase.co";
const supabaseKey = "sb_publishable_mfss4b_IaFPV7gB9OPXp-A_rIwnB6hW";
const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);
console.log(client);

const submitBtn = document.querySelector("#submit");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const age = document.querySelector("#age");
const course = document.querySelector("#course");

submitBtn.addEventListener("click", async (event) => {
    event.preventDefault()
  if (!name.value || !email.value || !age.value || !course.value) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Fill all data!",
    });
      
    return;
  }

    try {
      
    const { error } = await client.from("student_data").insert([
      {
        name: name.value,
        course: course.value,
        emailaddress: email.value,
        age: age.value,
      },
    ]);
    Swal.fire({
      title: "Student added successfully! 🎉",
      icon: "success",
      draggable: true,
    });
  } catch (error) {
    console.log(error);
  }
});
