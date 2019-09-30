<style lang="scss">
.page {
    .page-content-card-f {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap
    }

    .card-f {
        margin: 10px;
    }

    .card-adaptive {
        flex: 1 1 auto;
        max-width: 100%
    }

    .card-full-width {
        width: 100%;
    }

    .max-height-medium {
        max-height: 100px;
    }

    @media screen and (max-width: 40em) {
        .page-content-card-f {
            padding: 0;
        }

        .card-f {
            margin: 0;
        }
    }
}
</style>