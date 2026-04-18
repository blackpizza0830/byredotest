"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

type AdminGateStatus = "loading" | "not-signed-in" | "forbidden" | "allowed" | "error";

interface ProfileRow {
  id: string;
  role: "customer" | "admin";
  email: string;
  full_name: string | null;
  created_at: string;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  category: string;
  size: string;
  stock_quantity: number;
  is_active: boolean;
  image_url: string;
  created_at: string;
}

interface OrderRow {
  id: string;
  status: "pending" | "paid" | "cancelled" | "failed" | "refunded";
  total_amount: number;
  currency: string;
  created_at: string;
}

interface PaymentRow {
  id: string;
  status: "pending" | "authorized" | "paid" | "failed" | "cancelled" | "refunded";
  amount: number;
  currency: string;
  provider: string;
  created_at: string;
}

interface DashboardSnapshot {
  members: ProfileRow[];
  products: ProductRow[];
  orders: OrderRow[];
  payments: PaymentRow[];
}

interface ProductFormState {
  id: string | null;
  name: string;
  slug: string;
  price: string;
  category: string;
  size: string;
  imageUrl: string;
  stockQuantity: string;
  description: string;
  isActive: boolean;
}

const PRODUCT_FORM_INITIAL: ProductFormState = {
  id: null,
  name: "",
  slug: "",
  price: "",
  category: "BODY",
  size: "50 ml",
  imageUrl: "/images/shop_1.png",
  stockQuantity: "0",
  description: "",
  isActive: true,
};

export function AdminGate(): React.JSX.Element {
  const [status, setStatus] = useState<AdminGateStatus>("loading");
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [adminActionMessage, setAdminActionMessage] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormState>(PRODUCT_FORM_INITIAL);
  const [productActionMessage, setProductActionMessage] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const loadDashboard = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    setErrorMessage("");
    setIsRefreshing(true);

    const { data: authResult, error: authError } = await supabase.auth.getUser();

    if (authError) {
      setStatus("error");
      setErrorMessage(authError.message);
      setIsRefreshing(false);
      return;
    }

    if (!authResult.user) {
      setStatus("not-signed-in");
      setIsRefreshing(false);
      return;
    }

    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("id,role,email,full_name,created_at")
      .eq("id", authResult.user.id)
      .single<ProfileRow>();

    if (profileError) {
      setStatus("error");
      setErrorMessage(profileError.message);
      setIsRefreshing(false);
      return;
    }

    if (profileRow.role !== "admin") {
      setStatus("forbidden");
      setIsRefreshing(false);
      return;
    }

    const [membersResult, productsResult, ordersResult, paymentsResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,role,email,full_name,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("products")
        .select("id,name,slug,description,price,currency,category,size,stock_quantity,is_active,image_url,created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("id,status,total_amount,currency,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("payments")
        .select("id,status,amount,currency,provider,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const firstError =
      membersResult.error ?? productsResult.error ?? ordersResult.error ?? paymentsResult.error;

    if (firstError) {
      setStatus("error");
      setErrorMessage(firstError.message);
      setIsRefreshing(false);
      return;
    }

    setProfile(profileRow);
    setSnapshot({
      members: toProfileRows(membersResult.data),
      products: toProductRows(productsResult.data),
      orders: toOrderRows(ordersResult.data),
      payments: toPaymentRows(paymentsResult.data),
    });
    setStatus("allowed");
    setIsRefreshing(false);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const handlePromoteAdmin = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    const normalizedEmail = targetEmail.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setAdminActionMessage("Please enter a valid email address.");
      return;
    }

    setIsPromoting(true);
    setAdminActionMessage("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      setAdminActionMessage(
        sessionError?.message ?? "A valid session is required to grant admin access."
      );
      setIsPromoting(false);
      return;
    }

    const result = await callPromoteAdminByEmail({
      email: normalizedEmail,
      accessToken: session.access_token,
    });

    if (result === "not_found") {
      setAdminActionMessage("No member profile found for this email.");
      setIsPromoting(false);
      return;
    }
    if (result === "already_admin") {
      setAdminActionMessage("This account already has admin access.");
      setIsPromoting(false);
      return;
    }
    if (result === "forbidden") {
      setAdminActionMessage("Only administrators can grant admin access.");
      setIsPromoting(false);
      return;
    }
    if (result === "error") {
      setAdminActionMessage("Failed to grant admin access. Please try again.");
      setIsPromoting(false);
      return;
    }

    setAdminActionMessage("Admin role granted successfully.");
    setTargetEmail("");
    setIsPromoting(false);
    await loadDashboard();
  };

  const openCreateProductModal = (): void => {
    setProductForm(PRODUCT_FORM_INITIAL);
    setProductActionMessage("");
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: ProductRow): void => {
    setProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: String(Math.round(product.price)),
      category: product.category,
      size: product.size,
      imageUrl: product.image_url,
      stockQuantity: String(product.stock_quantity),
      description: product.description ?? "",
      isActive: product.is_active,
    });
    setProductActionMessage("");
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    const normalizedName = productForm.name.trim();
    const normalizedSlug = productForm.slug.trim().toLowerCase();
    const normalizedCategory = productForm.category.trim().toUpperCase();
    const normalizedSize = productForm.size.trim();
    const normalizedImageUrl = productForm.imageUrl.trim();
    const normalizedDescription = productForm.description.trim();
    const parsedPrice = Number(productForm.price);
    const parsedStock = Number(productForm.stockQuantity);

    if (!normalizedName) {
      setProductActionMessage("Product name is required.");
      return;
    }
    if (!normalizedSlug) {
      setProductActionMessage("Slug is required.");
      return;
    }
    if (!normalizedCategory) {
      setProductActionMessage("Category is required.");
      return;
    }
    if (!normalizedSize) {
      setProductActionMessage("Size is required.");
      return;
    }
    if (!normalizedImageUrl) {
      setProductActionMessage("Image URL is required.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setProductActionMessage("Price must be zero or greater.");
      return;
    }
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setProductActionMessage("Stock quantity must be a non-negative integer.");
      return;
    }

    setIsSavingProduct(true);
    setProductActionMessage("");

    if (productForm.id) {
      const { error } = await supabase
        .from("products")
        .update({
          name: normalizedName,
          slug: normalizedSlug,
          category: normalizedCategory,
          size: normalizedSize,
          image_url: normalizedImageUrl,
          description: normalizedDescription.length > 0 ? normalizedDescription : null,
          price: parsedPrice,
          stock_quantity: parsedStock,
          is_active: productForm.isActive,
        })
        .eq("id", productForm.id);

      if (error) {
        setProductActionMessage(error.message);
        setIsSavingProduct(false);
        return;
      }

      setProductActionMessage("Product updated successfully.");
      setIsSavingProduct(false);
      await loadDashboard();
      return;
    }

    const { error } = await supabase.from("products").insert({
      name: normalizedName,
      slug: normalizedSlug,
      category: normalizedCategory,
      size: normalizedSize,
      image_url: normalizedImageUrl,
      description: normalizedDescription.length > 0 ? normalizedDescription : null,
      price: parsedPrice,
      stock_quantity: parsedStock,
      is_active: productForm.isActive,
      currency: "KRW",
    });

    if (error) {
      setProductActionMessage(error.message);
      setIsSavingProduct(false);
      return;
    }

    setProductActionMessage("Product created successfully.");
    setProductForm(PRODUCT_FORM_INITIAL);
    setIsSavingProduct(false);
    await loadDashboard();
  };

  if (status === "loading") {
    return (
      <section className="mx-auto w-full max-w-[1080px] px-4 py-24">
        <p className="text-[12px] uppercase tracking-[0.2em] text-black/60">
          Checking admin access...
        </p>
      </section>
    );
  }

  if (status === "not-signed-in") {
    return (
      <section className="mx-auto w-full max-w-[1080px] px-4 py-24">
        <h1 className="text-[34px] uppercase tracking-[0.1em] text-black">Admin Access Required</h1>
        <p className="mt-4 max-w-[640px] text-[13px] leading-6 text-black/70">
          You are not signed in. Please sign in with an administrator account to continue.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center border border-black px-6 text-[11px] uppercase tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  if (status === "forbidden") {
    return (
      <section className="mx-auto w-full max-w-[1080px] px-4 py-24">
        <h1 className="text-[34px] uppercase tracking-[0.1em] text-black">Not Authorized</h1>
        <p className="mt-4 max-w-[640px] text-[13px] leading-6 text-black/70">
          Your account is signed in, but it does not have administrator permission.
        </p>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="mx-auto w-full max-w-[1080px] px-4 py-24">
        <h1 className="text-[34px] uppercase tracking-[0.1em] text-black">Access Check Failed</h1>
        <p className="mt-4 max-w-[640px] text-[13px] leading-6 text-black/70">
          {errorMessage || "Unable to verify your administrator role."}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1080px] px-4 py-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[34px] uppercase tracking-[0.1em] text-black">Admin Console</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCreateProductModal}
            className="h-10 border border-black bg-white px-4 text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => {
              setAdminModalOpen(true);
              setAdminActionMessage("");
            }}
            className="h-10 border border-black bg-black px-4 text-[10px] uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
          >
            Add Admin
          </button>
          <button
            type="button"
            onClick={() => {
              void loadDashboard();
            }}
            disabled={isRefreshing}
            className="h-10 border border-black px-4 text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>
      <p className="mt-4 max-w-[680px] text-[13px] leading-6 text-black/70">
        Signed in as <span className="text-black">{profile?.email}</span>. You have administrator
        access and can now proceed with member, product, and payment management features.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <StatCard label="Members" value={snapshot?.members.length ?? 0} />
        <StatCard label="Products" value={snapshot?.products.length ?? 0} />
        <StatCard label="Orders" value={snapshot?.orders.length ?? 0} />
        <StatCard label="Payments" value={snapshot?.payments.length ?? 0} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <DataCard title="Latest Members">
          {snapshot?.members.map((member) => (
            <DataRow
              key={member.id}
              main={member.email}
              sub={member.full_name ?? "No name"}
              right={member.role}
            />
          ))}
        </DataCard>

        <DataCard title="Latest Products">
          {snapshot?.products.slice(0, 6).map((product) => (
            <DataRow
              key={product.id}
              main={product.name}
              sub={`${product.slug} · ${formatKrw(product.price)}`}
              right={product.is_active ? "active" : "inactive"}
            />
          ))}
        </DataCard>

        <DataCard title="Latest Orders">
          {snapshot?.orders.map((order) => (
            <DataRow
              key={order.id}
              main={order.id.slice(0, 8)}
              sub={`${order.total_amount.toLocaleString()} ${order.currency}`}
              right={order.status}
            />
          ))}
        </DataCard>

        <DataCard title="Latest Payments">
          {snapshot?.payments.map((payment) => (
            <DataRow
              key={payment.id}
              main={payment.provider}
              sub={`${payment.amount.toLocaleString()} ${payment.currency}`}
              right={payment.status}
            />
          ))}
        </DataCard>
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[13px] uppercase tracking-[0.18em] text-black">Product Management</h2>
          <p className="text-[10px] uppercase tracking-[0.14em] text-black/60">
            {snapshot?.products.length ?? 0} products synced with /shop
          </p>
        </div>
        <div className="space-y-2">
          {snapshot?.products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border border-black/15 bg-white p-3"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.09em] text-black">{product.name}</p>
                <p className="mt-1 text-[11px] text-black/60">
                  {product.slug} · {product.category} · {product.size}
                </p>
                <p className="mt-1 text-[11px] text-black/60">
                  {formatKrw(product.price)} · Stock {product.stock_quantity} ·{" "}
                  {product.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEditProductModal(product)}
                className="h-9 border border-black px-3 text-[10px] uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {adminModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[460px] border border-black bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[16px] uppercase tracking-[0.14em] text-black">Grant Admin Access</h2>
              <button
                type="button"
                onClick={() => {
                  setAdminModalOpen(false);
                  setAdminActionMessage("");
                  setTargetEmail("");
                }}
                className="text-[10px] uppercase tracking-[0.15em] text-black/60 hover:text-black"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-black/70">
              Enter the email of an existing member account to promote it to admin.
            </p>
            <label className="mt-5 block text-[10px] uppercase tracking-[0.16em] text-black/60">
              Member Email
            </label>
            <input
              type="email"
              value={targetEmail}
              onChange={(event) => setTargetEmail(event.target.value)}
              placeholder="name@example.com"
              className="mt-2 h-11 w-full border border-black/20 px-3 text-[12px] text-black outline-none focus:border-black"
            />
            {adminActionMessage && (
              <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-black">{adminActionMessage}</p>
            )}
            <button
              type="button"
              onClick={() => {
                void handlePromoteAdmin();
              }}
              disabled={isPromoting}
              className="mt-5 h-11 w-full border border-black bg-black text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPromoting ? "Granting..." : "Grant Admin"}
            </button>
          </div>
        </div>
      )}

      {productModalOpen && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[620px] border border-black bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[16px] uppercase tracking-[0.14em] text-black">
                {productForm.id ? "Edit Product" : "Add Product"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setProductModalOpen(false);
                  setProductActionMessage("");
                  setProductForm(PRODUCT_FORM_INITIAL);
                }}
                className="text-[10px] uppercase tracking-[0.15em] text-black/60 hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ProductInput
                label="Name"
                value={productForm.name}
                onChange={(value) => setProductForm((prev) => ({ ...prev, name: value }))}
              />
              <ProductInput
                label="Slug"
                value={productForm.slug}
                onChange={(value) => setProductForm((prev) => ({ ...prev, slug: value }))}
              />
              <ProductInput
                label="Price (KRW)"
                value={productForm.price}
                onChange={(value) => setProductForm((prev) => ({ ...prev, price: value }))}
              />
              <ProductInput
                label="Stock Quantity"
                value={productForm.stockQuantity}
                onChange={(value) => setProductForm((prev) => ({ ...prev, stockQuantity: value }))}
              />
              <ProductInput
                label="Category"
                value={productForm.category}
                onChange={(value) => setProductForm((prev) => ({ ...prev, category: value }))}
              />
              <ProductInput
                label="Size"
                value={productForm.size}
                onChange={(value) => setProductForm((prev) => ({ ...prev, size: value }))}
              />
            </div>

            <label className="mt-4 block text-[10px] uppercase tracking-[0.16em] text-black/60">
              Image URL
            </label>
            <input
              type="text"
              value={productForm.imageUrl}
              onChange={(event) =>
                setProductForm((prev) => ({
                  ...prev,
                  imageUrl: event.target.value,
                }))
              }
              className="mt-2 h-11 w-full border border-black/20 px-3 text-[12px] text-black outline-none focus:border-black"
            />

            <label className="mt-4 block text-[10px] uppercase tracking-[0.16em] text-black/60">
              Description
            </label>
            <textarea
              value={productForm.description}
              onChange={(event) =>
                setProductForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full border border-black/20 px-3 py-2 text-[12px] text-black outline-none focus:border-black"
            />

            <label className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-black">
              <input
                type="checkbox"
                checked={productForm.isActive}
                onChange={(event) =>
                  setProductForm((prev) => ({
                    ...prev,
                    isActive: event.target.checked,
                  }))
                }
                className="size-4"
              />
              Active Product
            </label>

            {productActionMessage && (
              <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-black">
                {productActionMessage}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                void handleSaveProduct();
              }}
              disabled={isSavingProduct}
              className="mt-5 h-11 w-full border border-black bg-black text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingProduct
                ? "Saving..."
                : productForm.id
                ? "Save Product"
                : "Create Product"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps): React.JSX.Element {
  return (
    <article className="border border-black/20 bg-white p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-black/60">{label}</p>
      <p className="mt-3 text-[24px] leading-none text-black">{value}</p>
    </article>
  );
}

interface DataCardProps {
  title: string;
  children: React.ReactNode;
}

function DataCard({ title, children }: DataCardProps): React.JSX.Element {
  return (
    <article className="border border-black/20 bg-white p-5">
      <h2 className="text-[12px] uppercase tracking-[0.18em] text-black">{title}</h2>
      <div className="mt-4 space-y-2">{children}</div>
    </article>
  );
}

interface DataRowProps {
  main: string;
  sub: string;
  right: string;
}

function DataRow({ main, sub, right }: DataRowProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-3 border border-black/10 p-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.08em] text-black">{main}</p>
        <p className="mt-1 text-[11px] text-black/60">{sub}</p>
      </div>
      <span className="text-[10px] uppercase tracking-[0.12em] text-black/70">{right}</span>
    </div>
  );
}

function toProfileRows(value: unknown): ProfileRow[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      const id = readString(item, "id");
      const email = readString(item, "email");
      const role = readString(item, "role");
      if (!id || !email || (role !== "admin" && role !== "customer")) {
        return null;
      }
      return {
        id,
        email,
        role,
        full_name: readNullableString(item, "full_name"),
        created_at: readString(item, "created_at") ?? "",
      };
    })
    .filter((item): item is ProfileRow => item !== null);
}

function toProductRows(value: unknown): ProductRow[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      const id = readString(item, "id");
      const name = readString(item, "name");
      const slug = readString(item, "slug");
      const description = readNullableString(item, "description");
      const price = readNumber(item, "price");
      const currency = readString(item, "currency");
      const category = readString(item, "category");
      const size = readString(item, "size");
      const stockQuantity = readNumber(item, "stock_quantity");
      const isActive = readBoolean(item, "is_active");
      const imageUrl = readString(item, "image_url");
      if (
        !id ||
        !name ||
        !slug ||
        price === null ||
        !currency ||
        !category ||
        !size ||
        stockQuantity === null ||
        isActive === null ||
        !imageUrl
      ) {
        return null;
      }
      return {
        id,
        name,
        slug,
        description,
        price,
        currency,
        category,
        size,
        stock_quantity: stockQuantity,
        is_active: isActive,
        image_url: imageUrl,
        created_at: readString(item, "created_at") ?? "",
      };
    })
    .filter((item): item is ProductRow => item !== null);
}

function toOrderRows(value: unknown): OrderRow[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      const id = readString(item, "id");
      const status = readString(item, "status");
      const totalAmount = readNumber(item, "total_amount");
      const currency = readString(item, "currency");
      if (!id || !currency || totalAmount === null || !isOrderStatus(status)) {
        return null;
      }
      return {
        id,
        status,
        total_amount: totalAmount,
        currency,
        created_at: readString(item, "created_at") ?? "",
      };
    })
    .filter((item): item is OrderRow => item !== null);
}

function toPaymentRows(value: unknown): PaymentRow[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      const id = readString(item, "id");
      const status = readString(item, "status");
      const amount = readNumber(item, "amount");
      const currency = readString(item, "currency");
      const provider = readString(item, "provider");
      if (!id || !provider || !currency || amount === null || !isPaymentStatus(status)) {
        return null;
      }
      return {
        id,
        status,
        amount,
        currency,
        provider,
        created_at: readString(item, "created_at") ?? "",
      };
    })
    .filter((item): item is PaymentRow => item !== null);
}

function readString(value: unknown, key: string): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = Reflect.get(value, key);
  return typeof candidate === "string" ? candidate : null;
}

function readNullableString(value: unknown, key: string): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = Reflect.get(value, key);
  return typeof candidate === "string" ? candidate : null;
}

function readNumber(value: unknown, key: string): number | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = Reflect.get(value, key);
  if (typeof candidate === "number") {
    return candidate;
  }
  if (typeof candidate === "string" && candidate.trim().length > 0) {
    const parsed = Number(candidate);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readBoolean(value: unknown, key: string): boolean | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = Reflect.get(value, key);
  return typeof candidate === "boolean" ? candidate : null;
}

function isOrderStatus(value: string | null): value is OrderRow["status"] {
  return value === "pending" || value === "paid" || value === "cancelled" || value === "failed" || value === "refunded";
}

function isPaymentStatus(value: string | null): value is PaymentRow["status"] {
  return (
    value === "pending" ||
    value === "authorized" ||
    value === "paid" ||
    value === "failed" ||
    value === "cancelled" ||
    value === "refunded"
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type PromoteAdminResult = "promoted" | "already_admin" | "not_found" | "forbidden" | "error";

interface PromoteAdminParams {
  email: string;
  accessToken: string;
}

async function callPromoteAdminByEmail({
  email,
  accessToken,
}: PromoteAdminParams): Promise<PromoteAdminResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return "error";
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/promote_admin_by_email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ target_email: email }),
  });

  if (!response.ok) {
    return response.status === 403 ? "forbidden" : "error";
  }

  const result: unknown = await response.json();
  if (result === "promoted" || result === "already_admin" || result === "not_found" || result === "forbidden") {
    return result;
  }
  return "error";
}

function formatKrw(amount: number): string {
  return `₩${Math.round(amount).toLocaleString()}`;
}

interface ProductInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ProductInput({ label, value, onChange }: ProductInputProps): React.JSX.Element {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.16em] text-black/60">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full border border-black/20 px-3 text-[12px] text-black outline-none focus:border-black"
      />
    </div>
  );
}
