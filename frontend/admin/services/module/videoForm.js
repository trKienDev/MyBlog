export class videoFormObject {
        constructor(name, actress, codeAV, videoname) {
               this.name = name;
               this.actress = actress;
               this.codeAV = codeAV;
               this.videoname = videoname;
               this.listVideo = []; 
        }

        addVideo(videoFile, tag) {
                this.listVideo.push({ file: videoFile, tag: tag });
        }

        removeVideo(videoFile, tag) {
                this.listVideo.splice(index, 1);
        }

        toFormData() {
                const formData = new FormData();
                formData.append("name", this.name);
                formData.append("actress", this.actress);
                formData.append("codeAV", this.codeAV);
                formData.append("videoName", this.videoname);

                this.listVideo.forEach((video, index) => {
                        formData.append(`video_${index}`, video.file);
                        formData.append(`video_tag_${index}`, video.tag);
                });

                return formData;
        }
}