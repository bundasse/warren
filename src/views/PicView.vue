<script setup></script>
<template>
    <div>
        <template>
            <div class="picNote">
                <img src="" alt="" style="max-width: 500px;">
                <div class="picNoteTextArea">
                    <div class="picNoteProfile">
                        <div class="names">
                            <div class="name">닉네임</div>
                            <div class="writeTime">투고일시</div>
                        </div>
                        <div class="buttons">
                            <button><i class="bx bx-edit"></i></button>
                            <button><i class="bx bx-delete"></i></button>
                        </div>
                    </div>
                    <div>코멘트</div>
                    <p></p>
                </div>
            </div>
        </template>
    </div>
</template>

<style>
.picNoteProfile{
    display: flex;
    justify-content: space-between;
    align-items: end;
}
.picNoteProfile .names{
    display: flex;
    gap: 4px;
}
.picNoteProfile .name{
    font-size: 12px;
    font-weight: 700;
}
.picNoteProfile .writeTime{
    font-size: 12px;
}
.picNoteProfile .buttons{
    display: flex;
    gap: 4px;
}
</style>