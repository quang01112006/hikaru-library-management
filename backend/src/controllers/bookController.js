export const getAllBooks = (req, res)=>{
    res.status(200).json(books);
}

export const getBookById = (req, res)=>{
    res.status(200).json(books);
}

export const addBook = (req, res)=>{
    res.status(201)
}
export const updateBookInfo = (req, res)=>{
    res.status(200)
}
export const deleteBook = (req, res)=>{
    res.status(200)
}