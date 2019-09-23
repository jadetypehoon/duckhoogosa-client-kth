import AWS from "aws-sdk";

const albumBucketName = "duckhoogosa";
const bucketRegion = "ap-northeast-2";
const IdentityPoolId = "ap-northeast-2:ba805140-83ec-4793-8736-0641dd7d6f71";

export function UploadToS3(problemTitle, file, callback) {
  let authData = JSON.parse(localStorage.getItem("authData"));
  console.log("자격증명 토큰", { "accounts.google.com": authData.tokenId });
  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId,
      Logins: { "accounts.google.com": authData.tokenId }
    })
  });

  var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: albumBucketName
    }
  });
  console.log(file, "파일 바디체크");
  let fileName = file.name;
  let ProblemDirKey = encodeURIComponent(problemTitle) + "/";
  let photoKey = ProblemDirKey + fileName;
  console.log(file, "실전!", ProblemDirKey, photoKey);
  return s3.upload(
    {
      Key: photoKey,
      Body: file,
      ACL: "public-read"
    },
    (err, data) => {
      if (err) {
        console.error(err);
        return alert("There was an error uploading your photo: ", err.message);
      }
      console.log("Successfully uploaded photo.");
      if (callback) {
        callback(data.Location);
      }
      return data.Location;
    }
  );
}

// AWS.config.region = 'ap-northeast-2'; // 리전
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: 'ap-northeast-2:ba805140-83ec-4793-8736-0641dd7d6f71',
// });
