import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Editor } from "@tinymce/tinymce-react";
import { IoCaretBackOutline, IoDocumentText } from "react-icons/io5";
import { Box, Skeleton, TextField } from "@mui/material";
import {
  GetMyWork,
  SummitWork,
} from "../../../../../../service/student/assignment";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import Image from "next/image";
import "lightbox.js-react/dist/index.css";
import { CiFaceFrown } from "react-icons/ci";
import Swal from "sweetalert2";
import SendIcon from "@mui/icons-material/Send";
import {
  GetComments,
  PostComment,
} from "../../../../../../service/student/comment";
import Head from "next/head";
import { GetStudent } from "../../../../../../service/student/student";
import Loading from "../../../../../../components/loading/loading";
import { BsImageFill } from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";
import { FaFileAudio, FaRegFilePdf } from "react-icons/fa";

function Index() {
  const router = useRouter();
  const menus = [
    { title: "ส่งงาน", translate: "translate-x-1" },
    { title: "งานของคุณ", translate: "translate-x-28" },
    { title: "คอมเมนต์", translate: "translate-x-52" },
  ];
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [studentWork, setStudnetWork] = useState();
  const [assignment, setAssignment] = useState();
  const [deadline, setDeadline] = useState();
  const [fileSize, setFilesSize] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [studentSummit, setStudentSummit] = useState({
    body: "",
  });
  const comments = useQuery(
    ["comments"],
    () =>
      GetComments({
        assignmentId: assignment.id,
        studentId: router.query.studentId,
      }),
    {
      enabled: false,
    }
  );
  const student = useQuery(
    ["student"],
    () => GetStudent({ studentId: router.query.studentId }),
    {
      enabled: false,
    }
  );
  console.log(selectedFiles);
  const fetchStudentWork = useQuery(["student-work"], () =>
    GetMyWork({
      studentId: router.query.studentId,
      assignmentId: assignment.id,
    }).then((res) => {
      setStudnetWork(() => {
        let pictures = [];
        let files = [];
        if (res.data.status === "have-work") {
          if (res.data.picture) {
            const arrayPictures = res.data.picture.split(", ");
            for (const arrayPicture of arrayPictures) {
              const fileType = get_url_extension(arrayPicture);
              if (
                fileType === "jpg" ||
                fileType === "jpeg" ||
                fileType === "png" ||
                fileType === "HEIC" ||
                fileType === "JPEG" ||
                fileType === "PNG" ||
                fileType === "JPG" ||
                fileType === "heic"
              ) {
                pictures.push({ src: arrayPicture, alt: "student's work" });
              } else {
                files.push({ fileType: fileType, url: arrayPicture });
              }
            }
            return { ...res.data, picture: pictures, files: files };
          } else if (!res.data.picture) {
            return res.data;
          }
        } else if (res.data.status === "no-work") {
          return res.data;
        }
      });
      return res;
    })
  );
  console.log();
  const handleSummitWork = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      Swal.fire({
        title: "ยืนยันการส่งงาน",
        text: "คุณยังไม่ได้แนบไฟล์งาน แน่ใจใช่ไหมว่าจะส่ง?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append("files", file);
            });
            formFiles.append("body", studentSummit.body);
            formFiles.getAll("body");
            const summitWork = await SummitWork({
              formFiles,
              studentId: router.query.studentId,
              assignmentId: assignment.id,
            });

            fetchStudentWork.refetch();
            Swal.fire("success", "ส่งงานแล้ว", "success");
          } catch (err) {
            if (
              err?.props?.response?.data?.error.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                "error",
                "นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม",
                "error"
              );
            } else {
              Swal.fire("error", err?.props?.response?.data?.message, "error");
            }
            console.log(err);
          }
        }
      });
    } else if (selectedFiles.length > 0) {
      Swal.fire({
        title: "ยืนยันการส่งงาน",
        text: "นักเรียนแน่ใจหรือไม่ว่าจะส่งงาน? เนื่องจากส่งงานแล้วจะไม่สามารถลบงานได้ต้องติดต่อครูผู้สอน",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(() => true);
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append("files", file);
            });
            formFiles.append("body", studentSummit.body);
            formFiles.getAll("body");
            const summitWork = await SummitWork({
              formFiles,
              studentId: router.query.studentId,
              assignmentId: assignment.id,
            });
            setLoading(() => false);
            fetchStudentWork.refetch();
            Swal.fire("success", "ส่งงานแล้ว", "success");
          } catch (err) {
            setLoading(() => false);
            if (
              err?.props?.response?.data?.error.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                "error",
                "นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม",
                "error"
              );
            } else {
              Swal.fire("error", err?.props?.response?.data?.message, "error");
            }
            console.log(err);
          }
        }
      });
    }
  };
  //set files to array
  const handleFileEvent = (e) => {
    const choosenFiles = Array.prototype.slice.call(e.target.files);
    let totalSize = 0;

    for (let i = 0; i < choosenFiles.length; i++) {
      totalSize += choosenFiles[i].size;
    }
    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    setFilesSize(() => totalSizeInMB);
    setSelectedFiles(choosenFiles);
  };

  useEffect(() => {
    if (router.isReady) {
      student.refetch();
    }
    setTeacher(() => {
      const teacher = localStorage.getItem("teacher");
      return JSON.parse(teacher);
    });
    initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_KEY, "individual");
    const studentWork = localStorage.getItem("assignment");
    setAssignment(() => {
      const assignment = localStorage.getItem("assignment");
      const convertAssignment = JSON.parse(assignment);
      setDeadline(() => {
        const date = new Date(convertAssignment.assignment.deadline);
        const formattedDate = date.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return formattedDate;
      });
      return convertAssignment.assignment;
    });
    setTimeout(() => {
      fetchStudentWork.refetch();
    }, 500);
  }, [router.isReady]);

  const handleSumitComment = async (e) => {
    try {
      e.preventDefault();
      await PostComment({
        assignmentId: assignment.id,
        studentId: router.query.studentId,
        body: studentSummit.body,
      });
      setStudentSummit((prev) => {
        return {
          ...prev,
          body: "",
        };
      });
      comments.refetch();
    } catch (err) {
      Swal.fire("error", err?.props?.response?.data?.message, "error");
    }
  };

  // check file type
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  function handleShowStudentWork() {}

  return (
    <div className="  w-full h-full font-Kanit relative pb-96 bg-white  ">
      <Head>
        <title>students - assignment</title>
      </Head>
      <div className="w-full absolute top-0 flex justify-between items-center ">
        <div
          role="button"
          aria-label="button go back to classroom"
          onClick={() => {
            setLoading(true);
            router.push({
              pathname: `/classroom/student/${router.query.studentId}`,
              query: {
                classroomId: router.query.classroomId,
              },
            });
          }}
          className="w-max h-max  mt-2 ml-2 cursor-pointer group
        flex items-center justify-center active:scale-110 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-[#2C7CD1] flex items-center justify-center group-hover:scale-110 transition duration-150 ">
            <IoCaretBackOutline />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-start pt-16 gap-2">
        <div className="w-full flex gap-2 items-center justify-center">
          <div className="w-full ml-5 md:ml-0 h-max text-left max-w-3xl ">
            <span className="font-Kanit text-2xl ml-5 font-bold text-black tracking-wide">
              {assignment?.title}
            </span>
          </div>
        </div>
        <div className="w-11/12 grid gap-2  max-w-5xl">
          <div className="w-full grid grid-cols-3 place-items-start items-center">
            <div>student</div>
            {fetchStudentWork.isLoading || loading ? (
              <Skeleton variant="rounded" width="100%" height={20} />
            ) : (
              <div className="col-span-2 font-semibold">
                <span>
                  เลขที่ {student?.data?.data?.number}{" "}
                  {student?.data?.data?.firstName}{" "}
                  {student?.data?.data?.lastName}
                </span>
              </div>
            )}
          </div>
          <div className="w-full  grid grid-cols-3 place-items-start items-center ">
            <div>Assign by</div>
            <div className="flex gap-2 justify-center items-center col-span-2">
              <span className="uppercase">
                {teacher?.firstName} {teacher?.lastName}
              </span>
              {teacher?.picture ? (
                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-slate-400">
                  <Image
                    src={teacher?.picture}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-blue-400 flex items-center justify-center">
                  <div className="font-Kanit font-bold text-2xl uppercase text-center text-white ">
                    {teacher?.firstName.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 place-items-start items-center">
            <div>Deadline</div>
            {fetchStudentWork.isLoading || loading ? (
              <Skeleton variant="rounded" width="100%" height={20} />
            ) : (
              <div className="col-span-2 font-semibold">{deadline}</div>
            )}
          </div>
          <div className="w-full grid grid-cols-3 place-items-start items-center">
            <div>Score</div>
            {fetchStudentWork.isLoading || loading ? (
              <Skeleton variant="rounded" width="100%" height={20} />
            ) : (
              <div className="text-lg">
                <span>{!studentWork?.score ? 0 : studentWork.score}</span>
                <span>/</span>
                <span>{assignment?.maxScore}</span>
              </div>
            )}
          </div>
          <div className="w-full grid grid-cols-3 place-items-start items-center ">
            <div>Status</div>
            {studentWork?.status === "no-work" && (
              <div
                className="w-max px-2 h-4 bg-red-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
              >
                <span className="flex items-center justify-center font-Kanit text-white flex-col">
                  <div className="text-sm">
                    <span>ไม่ส่งงาน</span>
                  </div>
                </span>
              </div>
            )}
            {studentWork?.status === "have-work" &&
              studentWork.isSummited === false && (
                <div
                  className="w-max px-2 h-4 bg-yellow-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
                >
                  <span className="flex items-center justify-center font-Kanit text-white flex-col">
                    <div className="text-sm">
                      <span>รอตรวจ</span>
                    </div>
                  </span>
                </div>
              )}
            {studentWork?.status === "have-work" &&
              studentWork.isSummited === true && (
                <div
                  className="w-max px-2 h-4 bg-green-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
                >
                  <span className="flex items-center justify-center font-Kanit text-white flex-col">
                    <div className="text-sm">
                      <span>ตรวจแล้ว</span>
                    </div>
                  </span>
                </div>
              )}
          </div>
        </div>
        <div className="h-max w-11/12 bg-gray-200 lg:text-lg rounded-md max-w-4xl overflow-x-auto">
          <div
            className=" p-5  text-black font-Kanit"
            dangerouslySetInnerHTML={{
              __html: assignment?.description,
            }}
          />
        </div>
        <div className="font-Poppins flex w-full max-w-5xl h-10 mt-5 gap-10 font-semibold text-[#2C7CD1] relative ">
          {menus.map((menu, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  if (index === 2) {
                    comments.refetch();
                  }
                  setActiveMenu(index);
                }}
                className={`${index === 0 && "ml-10"} cursor-pointer`}
              >
                <span
                  className={`${
                    activeMenu === index ? "font-bold" : "font-normal"
                  }`}
                >
                  {menu.title}
                </span>
              </div>
            );
          })}
          <div
            className={`w-28 z-20 absolute h-1 bottom-0  ${menus[activeMenu]?.translate} left-0 transition duration-150 bg-blue-200`}
          ></div>
          <div className="absolute bottom-0 w-full h-1 bg-gray-200"></div>
        </div>

        {activeMenu === 0 && (
          <form
            onSubmit={handleSummitWork}
            className="w-9/12 max-w-3xl h-full  mt-1 flex flex-col gap-2"
          >
            <span className="text-sm text-red-500">
              สามารส่งไฟล์ mp4, mp3, docx, pdf,jpge, png ได้แล้ว ขนาดไม่เกิน 100
              MB
            </span>
            {fetchStudentWork.isLoading ? (
              <Skeleton variant="rounded" width="100%" height={300} />
            ) : (
              <label className="w-max">
                {loading ? (
                  <div>
                    <Loading />
                  </div>
                ) : (
                  <input
                    onChange={handleFileEvent}
                    name="files"
                    aria-label="upload image"
                    type="file"
                    multiple="multiple"
                    accept="
application/pdf,
    image/jpeg,
    image/png,
    image/gif,
    application/msword,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    video/mp4,
    audio/mpeg"
                    className="text-sm text-grey-500 
            file:mr-5 md:file:w-40 file:w-40 w-max file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-Kanit file:font-normal file:text-white
             bg-white rounded-full
            file:bg-blue-400 file:drop-shadow-lg
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                  />
                )}
              </label>
            )}
            <div className="flex gap-2">
              <span>ไฟล์ที่คุณเลือกมีขนาด</span>
              <span>{fileSize}MB</span>
            </div>
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 place-items-center gap-5">
                {selectedFiles.map((file) => {
                  if (file.type === "image/jpeg" || file.type === "")
                    return (
                      <div className="w-full flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                        <div className="flex items-center justify-center text-green-700">
                          <BsImageFill />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                      </div>
                    );
                  if (
                    file.type === "video/mp4" ||
                    file.type === "video/quicktime"
                  )
                    return (
                      <div className="w-full flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                        <div className="flex items-center justify-center text-green-700">
                          <FcVideoFile />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                      </div>
                    );
                  if (file.type === "audio/mpeg" || file.type === "audio/mp3")
                    return (
                      <div className="w-full flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                        <div className="flex items-center justify-center text-red-700">
                          <FaFileAudio />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                      </div>
                    );
                  if (file.type === "application/pdf")
                    return (
                      <div className="w-full flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                        <div className="flex items-center justify-center text-gray-700">
                          <FaRegFilePdf />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                      </div>
                    );
                  if (
                    file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  )
                    return (
                      <div className="w-full flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                        <div className="flex items-center justify-center text-blue-700">
                          <IoDocumentText />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                      </div>
                    );
                })}
              </div>
            )}
            {loading ? (
              <div
                className="w-40 h-10 mt-5  bg-gray-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
              >
                โปรดรอสักครู่
              </div>
            ) : fileSize > 100 ? (
              <div
                className="w-40 h-10 mt-5  bg-red-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
              >
                ขนาดไฟล์เกิน
              </div>
            ) : selectedFiles.length > 0 ? (
              <button
                type="submit"
                className="w-40 h-10 mt-5  bg-green-500 drop-shadow-md text-white rounded-xl
       flex items-center justify-center"
              >
                ส่งงาน
              </button>
            ) : (
              <button
                type="submit"
                className="w-40 h-10 mt-5  bg-red-500 drop-shadow-md text-white rounded-xl
   flex items-center justify-center"
              >
                ส่งงานโดยไม่แนบไฟล์
              </button>
            )}
          </form>
        )}

        {activeMenu === 1 && (
          <div className="w-11/12 h-max max-w-3xl">
            {studentWork.status === "no-work" ? (
              <div className="font-Kanit text-2xl text-red-400 font-light h-20 flex items-center justify-center gap-2">
                <span>คุณยังไม่ส่งงาน</span>
                <div className="flex items-center justify-center ">
                  <CiFaceFrown />
                </div>
              </div>
            ) : (
              <div className="w-full  flex flex-col   gap-5 mt-5">
                {studentWork.picture && (
                  <SlideshowLightbox
                    downloadImages={true}
                    lightboxIdentifier="lightbox1"
                    showThumbnails={true}
                    framework="next"
                    images={studentWork.picture}
                    theme="day"
                    className={`container grid w-full  h-max items-center place-items-center
                         gap-2 grid-cols-2 md:grid-cols-3  `}
                  >
                    {studentWork?.picture?.map((image, index) => {
                      return (
                        <Image
                          key={index}
                          src={image.src}
                          alt={image.alt}
                          width={240}
                          height={160}
                          className="object-cover "
                          data-lightboxjs="lightbox1"
                          quality={80}
                        />
                      );
                    })}
                  </SlideshowLightbox>
                )}
                <div className="flex flex-col gap-5 justify-start items-center">
                  {studentWork?.files?.length > 0 &&
                    studentWork?.files.map((file, index) => {
                      if (file.fileType === "pdf") {
                        return (
                          <div
                            key={index}
                            className="w-full flex justify-center"
                          >
                            <embed
                              src={file.url}
                              type="application/pdf"
                              frameBorder="0"
                              scrolling="auto"
                              height="500px"
                              width="80%"
                            ></embed>
                          </div>
                        );
                      }
                      if (file.fileType === "docx") {
                        return (
                          <div
                            key={index}
                            className="w-full flex  justify-center"
                          >
                            <iframe
                              width="80%"
                              height="500px"
                              src={`https://docs.google.com/gview?url=${file.url}&embedded=true`}
                            ></iframe>
                          </div>
                        );
                      }
                      if (
                        file.fileType === "mp4" ||
                        file.fileType === "mov" ||
                        file.fileType === "MOV"
                      ) {
                        return (
                          <div
                            key={index}
                            className="w-full flex  justify-center"
                          >
                            <video controls width="80%">
                              <source src={file.url} type="video/mp4" />
                              Sorry, your browser doesn't support videos.
                            </video>
                          </div>
                        );
                      }
                      if (file.fileType === "mp3" || file.fileType === "aac") {
                        return (
                          <div
                            key={index}
                            className="w-full flex  justify-center"
                          >
                            <audio
                              src={file.url}
                              controls={true}
                              autoPlay={false}
                            />
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            )}
          </div>
        )}
        {activeMenu === 2 && (
          <form
            onSubmit={handleSumitComment}
            className="w-11/12 max-w-3xl h-full mt-1 flex flex-col gap-2"
          >
            {studentWork?.body && (
              <div className="w-11/12 flex justify-start">
                <div className="w-full max-w-5xl pr-6 h-max p-2 rounded-lg bg-blue-50 flex">
                  <span className="font-semibold">นักเรียน:</span>
                  <div
                    style={{
                      wordWrap: "break-word",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                    className="h-max w-full  overflow-hidden ml-2"
                    dangerouslySetInnerHTML={{
                      __html: studentWork?.body,
                    }}
                  />
                </div>
              </div>
            )}
            {comments?.data?.data?.map((comment) => {
              if (comment.user) {
                return (
                  <div className=" w-full h-max mt-5 flex items-start justify-start relative ">
                    <div className="flex gap-2 ml-2">
                      {comment.user.picture ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          <Image
                            src={comment.user.picture}
                            alt="profile"
                            layout="fill"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                          <span className="uppercase font-sans font-black text-3xl text-white">
                            {comment.user.firstName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="w-full max-w-[15rem] md:max-w-md h-max pr-10  bg-green-100 rounded-3xl relative  p-2">
                        <div className="text-md ml-4 font-bold first-letter:uppercase">
                          {comment.user.firstName}
                          {comment.user?.lastName}
                        </div>
                        <div
                          className="pl-4 "
                          style={{
                            wordWrap: "break-word",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: comment.body,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              } else if (comment.student) {
                return (
                  <div className=" w-full h-max mt-5 flex items-start justify-start relative ">
                    <div className="flex gap-2 ml-2">
                      {comment.student.picture ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          <Image
                            src={comment.student.picture}
                            alt="profile"
                            layout="fill"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                          <span className="uppercase font-sans font-black text-3xl text-white">
                            {comment.student.firstName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div
                        className="w-full max-w-[15rem] md:max-w-md pr-10 
                       bg-blue-100 rounded-3xl h-full relative  p-2"
                      >
                        <div className="text-md ml-4 font-bold first-letter:uppercase">
                          {comment.student.firstName}
                          {comment.student?.lastName}
                        </div>
                        <div
                          className="pl-4 "
                          style={{
                            wordWrap: "break-word",
                            overflowY: "auto",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: comment.body,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {fetchStudentWork.isLoading || loading ? (
              <Skeleton variant="rounded" width="100%" height={300} />
            ) : (
              <div className="h-96 w-full bg-slate-400 mt-5 relative overflow-hidden rounded-xl drop-shadow-md">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                  textareaName="body"
                  init={{
                    link_context_toolbar: true,
                    height: "100%",
                    width: "100%",
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                  }}
                  initialValue=""
                  value={studentSummit.body}
                  onEditorChange={(newText) => {
                    setStudentSummit((prevState) => {
                      return {
                        ...prevState,
                        body: newText,
                      };
                    });
                  }}
                />
              </div>
            )}
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="w-20 h-10 bg-green-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Index;
