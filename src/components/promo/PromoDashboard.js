import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
    IconButton,
    Button,
    CircularProgress,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Alert,
    Stack,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PromoDashboard = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        code: "",
        discountAmount: "",
        discountType: "flat",
        description: "",
        expiresAt: "",
        isActive: true
    });
    const [alert, setAlert] = useState({ message: "", severity: "" });
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const fetchPromoCodes = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setAlert({ message: "You are not authorized. Please log in.", severity: "warning" });
                setTimeout(() => navigate("/login"), 1500);
                setLoading(false);
                return;
            }

            const res = await fetch("http://localhost:4000/api/offer/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 401) {
                localStorage.removeItem("token");
                setAlert({ message: "Session expired. Please log in again.", severity: "warning" });
                setTimeout(() => navigate("/login"), 1500);
                setLoading(false);
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch promo codes");
            const data = await res.json();
            setPromoCodes(data.Promocodes || []);
        } catch (err) {
            setError(err.message || "Error fetching promo codes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();  // eslint-disable-next-line
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = type === "checkbox" ? checked : value;

        if (name === "discountAmount" && form.discountType === "percent") {
            const num = Number(newValue);
            if (num > 100) newValue = "100";
            if (num < 0) newValue = "0";
        }

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.code.trim()) newErrors.code = "Promo code is required";
        if (!form.discountAmount) {
            newErrors.discountAmount = "Discount amount is required";
        } else if (Number(form.discountAmount) <= 0) {
            newErrors.discountAmount = "Discount must be greater than 0";
        }
        if (!form.discountType) newErrors.discountType = "Select a discount type";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.expiresAt) {
            newErrors.expiresAt = "Expiry date is required";
        } else if (new Date(form.expiresAt) < new Date()) {
            newErrors.expiresAt = "Expiry date must be in the future";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setFormLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setAlert({ message: "Unauthorized. Please log in.", severity: "warning" });
                return;
            }

            const res = await fetch("http://localhost:4000/api/offer/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok || !data.status) {
                throw new Error(data.message || "Failed to create promo code");
            }

            setAlert({ message: "Promo code created successfully!", severity: "success" });
            setTimeout(() => {
                setOpen(false);
                setAlert({ message: "", severity: "" });
                setForm({
                    code: "",
                    discountAmount: "",
                    discountType: "flat",
                    description: "",
                    expiresAt: "",
                    isActive: true
                });
                setErrors({});
            }, 1500);

            fetchPromoCodes();
        } catch (error) {
            setAlert({ message: error.message || "Server error!", severity: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (promoId) => {
        if (!window.confirm("Are you sure you want to delete this promo code?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setAlert({ message: "Unauthorized. Please log in.", severity: "warning" });
                return;
            }

            const res = await fetch(`http://localhost:4000/api/offer/${promoId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok || !data.status) {
                throw new Error(data.message || "Failed to delete promo code");
            }

            setPromoCodes((prev) => prev.filter((promo) => promo._id !== promoId));
            setAlert({ message: "Promo code deleted successfully!", severity: "success" });
        } catch (err) {
            setAlert({ message: err.message || "Error deleting promo code", severity: "error" });
        }
    };

    const handleEdit = (promoId) => {
        navigate(`/promos/create?id=${promoId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
               
                    All Promo Codes
                </Typography>
                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        textTransform: "none",
                        borderRadius: "50px",
                        padding: "6px 18px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        borderColor: "#4caf50",
                        color: "#4caf50",
                        "&:hover": {
                            backgroundColor: "#4caf50",
                            color: "#fff",
                            borderColor: "#4caf50",
                        },
                    }}
                >
                    Add Promo
                </Button>
            </Box>

            <Grid container spacing={3}>
                {promoCodes
                    .slice()
                    .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                    .map((promo) => (
                    <Grid item xs={12} sm={6} md={4} key={promo._id}>
                    <Card
                        sx={{
                        borderRadius: "16px",
                        p: 3,
                        position: "relative",
                        background: "linear-gradient(135deg, #e8f5e9 30%, #a5d6a7 100%)",
                        boxShadow: "0px 6px 16px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "2px double #588157 ",
                        overflow: "hidden",
                        }}
                    >
                        {/* Status Chip */}
                        <Box
                            sx={{
                            position: "absolute",
                            top: 16,
                            left: -40,
                            backgroundColor: promo.isActive ? "#4caf50" : "#9e9e9e",
                            color: "white",
                            px: 6,
                            py: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            transform: "rotate(-45deg)",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                            zIndex: 2,
                            }}
                        >
                            {promo.isActive ? "ACTIVE" : "INACTIVE"}
                        </Box>

                        {/* Discount Info */}
                        <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            mb: 2,
                            mt: 2,
                            fontSize: "1.1rem",
                            color: "#263238",
                        }}
                        >
                        {promo.discountType === "percent"
                            ? `Get ${promo.discountAmount}% off!`
                            : `Get ₹${promo.discountAmount} off!`}
                        </Typography>

                        {/* Description */}
                        <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            mb: 2,
                            color: "#546e7a",
                        }}
                        >
                        {promo.description}
                        </Typography>

                        {/* Coupon Code Box */}
                        <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px hidden #1976d2",
                            borderRadius: "12px",
                            px: 2,
                            py: 1,
                            mb: 2,
                            width: "100%",
                            backgroundColor: "#e8f5e9",
                        }}
                        >
                        <Typography
                            sx={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#1b5e20",
                            }}
                        >
                            {promo.code}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => {
                            navigator.clipboard.writeText(promo.code);
                            setSnackbar({ open: true, message: "Promo code copied!" });
                            }}
                        >
                            <CopyIcon fontSize="small" sx={{ color: "#1b5e20" }} />
                        </IconButton>
                        </Box>

                        {/* Valid Date */}
                        <Typography
                        variant="body2"
                        sx={{ mb: 2, color: "#757575", textAlign: "center" }}
                        >
                        Valid Till: {new Date(promo.expiresAt).toLocaleDateString("en-GB")}
                        </Typography>

                        {/* Actions */}
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, width: "100%", backgroundColor: "transparent" }}>
                        <Button
                            variant="outlined"
                            size="small"
                            color="info"
                            sx={{
                            textTransform: "none",
                            borderRadius: "50px",
                            padding: "4px 16px",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "info.main",
                                color: "#fff",
                            },
                            }}
                            onClick={() => handleEdit(promo._id)}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                            textTransform: "none",
                            borderRadius: "50px",
                            padding: "4px 16px",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            borderColor: "#ec407a",
                            color: "#c2185b",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#c2185b",
                                borderColor: "#c2185b",
                                color: "#fff",
                            },
                            }}
                            onClick={() => handleDelete(promo._id)}
                        >
                            Remove
                        </Button>
                        </Box>
                    </Card>
                    </Grid>
                ))}
            </Grid>


            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Promo Code</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {alert.message && <Alert severity={alert.severity}>{alert.message}</Alert>}

                        <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Promo Code</Typography>
                            <TextField
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                error={!!errors.code}
                                helperText={errors.code}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Discount Amount</Typography>
                            <TextField
                                name="discountAmount"
                                type="number"
                                value={form.discountAmount}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                error={!!errors.discountAmount}
                                helperText={errors.discountAmount}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {form.discountType === 'percent' ? '%' : '₹'}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Discount Type</Typography>
                            <TextField
                                name="discountType"
                                select
                                value={form.discountType}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                error={!!errors.discountType}
                                helperText={errors.discountType}
                            >
                                <MenuItem value="flat">Flat</MenuItem>
                                <MenuItem value="percent">Percent</MenuItem>
                            </TextField>
                        </Box>

                        <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Description</Typography>
                            <TextField
                                name="description"
                                multiline
                                rows={2}
                                value={form.description}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Expires At</Typography>
                            <TextField
                                name="expiresAt"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={form.expiresAt}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                error={!!errors.expiresAt}
                                helperText={errors.expiresAt}
                            />
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    name="isActive"
                                />
                            }
                            label="Active"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2, mb: 1, mr: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                textTransform: "none",
                                borderRadius: "10px",
                                padding: "4px 16px",
                                fontWeight: "600",
                                fontSize: "0.85rem",
                                borderColor: "#607d8b",
                                color: "#263238",
                                "&:hover": {
                                    backgroundColor: "#546e7a",
                                    borderColor: "#455a64",
                                    color: "#fff",
                                },
                            }}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            size="small"
                            color="info"
                            disabled={formLoading}
                            sx={{
                                textTransform: "none",
                                borderRadius: "10px",
                                padding: "4px 16px",
                                fontWeight: "600",
                                fontSize: "0.85rem",
                                "&:hover": {
                                    backgroundColor: "info.dark",
                                    color: "#fff",
                                },
                            }}
                            onClick={handleSubmit}
                        >
                            {formLoading ? "Creating..." : "Submit"}
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PromoDashboard;
