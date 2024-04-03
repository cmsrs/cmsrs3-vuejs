<template>
    <div class="container msg-info mt-3 mb-3">
        <div class="row mt-3 mb-3">
            <div v-if="msgGood" class="alert alert-primary" role="alert_success">
                {{ msgGood }}
            </div>            
            <div v-if="msgWrong && typeof msgWrong === 'string'" class="alert alert-danger" role="alert_danger">
                {{ msgWrong }}
            </div>          
            <div v-if="msgWrong && typeof msgWrong === 'object' && msgWrong.length" class="alert alert-danger" role="alert_danger">          
                <ul>
                    <li v-for="(value, key) in msgWrong" :key="key">
                    {{ key }}: {{ value[0] }}
                    </li>
                </ul>            
            </div>      
        </div>
    </div>
</template>    
<script>
export default {
    props: {
        msgGood: String,
        msgWrong: [Array, String]
    }
};
</script>